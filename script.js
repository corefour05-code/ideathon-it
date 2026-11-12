(function () {
  const cfg = typeof IDEATHON_CONFIG !== "undefined" ? IDEATHON_CONFIG : {};
  const gform = cfg.googleForm || {};

  // 1. Hydrate schedule & config status
  const cfgDate = document.getElementById("cfgDate");
  const cfgVenue = document.getElementById("cfgVenue");
  const cfgRegDeadline = document.getElementById("cfgRegDeadline");
  const cfgPitchDate = document.getElementById("cfgPitchDate");

  if (cfg.schedule) {
    if (cfgDate && cfg.schedule.ideathonDate) cfgDate.textContent = cfg.schedule.ideathonDate;
    if (cfgVenue && cfg.schedule.venue) cfgVenue.textContent = cfg.schedule.venue;
    if (cfgRegDeadline && cfg.schedule.registrationDeadline) {
      cfgRegDeadline.textContent = `Deadline: ${cfg.schedule.registrationDeadline}`;
    }
    if (cfgPitchDate && cfg.schedule.ideathonDate) {
      cfgPitchDate.textContent = `Date: ${cfg.schedule.ideathonDate}`;
    }
  }

  const hasDirectPost = Boolean(gform.formActionUrl && gform.formActionUrl.trim());
  const hasAppsScript = Boolean(gform.appsScriptUrl && gform.appsScriptUrl.trim());

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
      });
    });
  }

  // 3. Theme Card -> Pre-fill Registration Select
  const themeCards = document.querySelectorAll(".theme-card[data-theme]");
  const themeSelect = document.getElementById("themeSelect");
  const registerSection = document.getElementById("register");

  themeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const selectedTheme = card.getAttribute("data-theme");
      themeCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      if (themeSelect && selectedTheme) {
        themeSelect.value = selectedTheme;
      }
      if (registerSection) {
        registerSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      themeCards.forEach((c) => {
        c.classList.toggle("selected", c.getAttribute("data-theme") === themeSelect.value);
      });
    });
  }

  // 4. Dynamic Team Members (Min 2, Max 4 total: Team Lead + 1 to 3 Members)
  const sizeButtons = document.querySelectorAll(".size-btn[data-size]");
  const teamSizeInput = document.getElementById("teamSize");
  const membersContainer = document.getElementById("membersContainer");
  const memberCache = {};

  function saveCurrentMemberInputs() {
    if (!membersContainer) return;
    membersContainer.querySelectorAll("input[data-member][data-field]").forEach((input) => {
      const idx = input.getAttribute("data-member");
      const field = input.getAttribute("data-field");
      if (!memberCache[idx]) memberCache[idx] = {};
      memberCache[idx][field] = input.value;
    });
  }

  function createMemberField(memberNum, fieldKey, labelText) {
    const wrap = document.createElement("div");
    wrap.className = "field";

    const id = `member${memberNum}_${fieldKey}`;
    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = `${labelText} `;

    const req = document.createElement("span");
    req.className = "req";
    req.textContent = "*";
    label.appendChild(req);

    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.name = id;
    input.required = true;
    input.setAttribute("data-member", String(memberNum));
    input.setAttribute("data-field", fieldKey);

    if (memberCache[memberNum] && memberCache[memberNum][fieldKey]) {
      input.value = memberCache[memberNum][fieldKey];
    }

    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }

  function renderMemberBlocks(totalSize) {
    if (!membersContainer) return;
    saveCurrentMemberInputs();
    membersContainer.textContent = "";

    for (let num = 2; num <= totalSize; num += 1) {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "form-block";

      const legend = document.createElement("legend");
      legend.textContent = `${num + 1}. Team Member ${num} Details`;
      fieldset.appendChild(legend);

      const grid = document.createElement("div");
      grid.className = "form-grid-3";

      grid.appendChild(createMemberField(num, "name", "Full Name"));
      grid.appendChild(createMemberField(num, "regNo", "Register Number"));
      grid.appendChild(createMemberField(num, "section", "Section"));

      fieldset.appendChild(grid);
      membersContainer.appendChild(fieldset);
    }
  }

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const size = Number(btn.getAttribute("data-size")) || 4;
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (teamSizeInput) teamSizeInput.value = String(size);
      renderMemberBlocks(size);
    });
  });

  // Initialize with 4 members (1 Lead + 3 Members)
  renderMemberBlocks(4);

  // 6. Form Validation & Submission
  const form = document.getElementById("ideathonForm");
  const formError = document.getElementById("formError");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");

  const modal = document.getElementById("successModal");
  const modalBadge = document.getElementById("modalBadge");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const summaryOutput = document.getElementById("summaryOutput");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const copySummaryBtn = document.getElementById("copySummaryBtn");

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.hidden = false;
    formError.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function clearError() {
    if (!formError) return;
    formError.textContent = "";
    formError.hidden = true;
  }

  function collectFormPayload() {
    const teamSize = Number(teamSizeInput ? teamSizeInput.value : 4);
    const payload = {
      teamName: document.getElementById("teamName").value.trim(),
      theme: document.getElementById("themeSelect").value.trim(),
      ideaTitle: document.getElementById("ideaTitle").value.trim(),
      teamSize,
      lead: {
        name: document.getElementById("leadName").value.trim(),
        regNo: document.getElementById("leadRegNo").value.trim().toUpperCase(),
        section: document.getElementById("leadSection").value.trim().toUpperCase(),
        phone: document.getElementById("leadPhone").value.trim(),
      },
      members: [],
    };

    for (let i = 2; i <= teamSize; i += 1) {
      payload.members.push({
        index: i,
        name: document.getElementById(`member${i}_name`).value.trim(),
        regNo: document.getElementById(`member${i}_regNo`).value.trim().toUpperCase(),
        section: document.getElementById(`member${i}_section`).value.trim().toUpperCase(),
      });
    }

    return payload;
  }

  function validatePayload(data) {
    if (!data.teamName) return "Please enter your Team Name.";
    if (!data.theme) return "Please select an Ideathon Theme.";
    if (!Number.isInteger(data.teamSize) || data.teamSize < 2 || data.teamSize > 4) {
      return "Team size must be between 2 and 4 members (solo participation is not permitted).";
    }
    if (!data.lead.name || !data.lead.regNo || !data.lead.section) {
      return "Please complete all required Team Lead details (Name, Register Number, Section).";
    }
    if (!data.lead.phone || data.lead.phone.replace(/\D/g, "").length < 10) {
      return "Please enter a valid 10-digit mobile number for the Team Lead.";
    }

    const regNos = new Set([data.lead.regNo]);
    for (const m of data.members) {
      if (!m.name || !m.regNo || !m.section) {
        return `Please fill in Name, Register Number, and Section for Team Member ${m.index}.`;
      }
      if (regNos.has(m.regNo)) {
        return `Duplicate Register Number detected (${m.regNo}). Every team member must have a unique Register Number.`;
      }
      regNos.add(m.regNo);
    }

    return null;
  }

  function formatSummaryText(data) {
    const lines = [
      `Event: ${cfg.eventTitle || "IT Ideathon — 1st Year Edition"}`,
      `Team Name: ${data.teamName}`,
      `Theme: ${data.theme}`,
      data.ideaTitle ? `Idea Title: ${data.ideaTitle}` : null,
      `Team Size: ${data.teamSize} Member(s)`,
      "",
      `[Team Lead - Member 1]`,
      `Name: ${data.lead.name}`,
      `Register No: ${data.lead.regNo} | Section: ${data.lead.section}`,
      `Phone: ${data.lead.phone}`,
    ].filter((v) => v !== null);

    data.members.forEach((m) => {
      lines.push(
        "",
        `[Team Member ${m.index}]`,
        `Name: ${m.name}`,
        `Register No: ${m.regNo} | Section: ${m.section}`
      );
    });

    return lines.join("\n");
  }

  async function submitToGoogleForm(data) {
    const ids = gform.entryIds || {};
    const params = new URLSearchParams();

    const appendIfSet = (entryKey, value) => {
      if (ids[entryKey] && value !== undefined && value !== null) {
        params.append(ids[entryKey], String(value));
      }
    };

    appendIfSet("teamName", data.teamName);
    appendIfSet("theme", data.theme);
    appendIfSet("ideaTitle", data.ideaTitle || "-");
    appendIfSet("teamSize", data.teamSize);

    appendIfSet("leadName", data.lead.name);
    appendIfSet("leadRegNo", data.lead.regNo);
    appendIfSet("leadSection", data.lead.section);
    appendIfSet("leadPhone", data.lead.phone);

    const m2 = data.members.find((m) => m.index === 2);
    const m3 = data.members.find((m) => m.index === 3);
    const m4 = data.members.find((m) => m.index === 4);

    // Member 2 fields may be marked Required in Google Forms; send "-" if solo team
    appendIfSet("member2Name", m2 ? m2.name : "-");
    appendIfSet("member2RegNo", m2 ? m2.regNo : "-");
    appendIfSet("member2Section", m2 ? m2.section : "-");

    appendIfSet("member3Name", m3 ? m3.name : "");
    appendIfSet("member3RegNo", m3 ? m3.regNo : "");
    appendIfSet("member3Section", m3 ? m3.section : "");

    appendIfSet("member4Name", m4 ? m4.name : "");
    appendIfSet("member4RegNo", m4 ? m4.regNo : "");
    appendIfSet("member4Section", m4 ? m4.section : "");

    await fetch(gform.formActionUrl, {
      method: "POST",
      mode: "no-cors",
      body: params,
    });
  }

  async function submitToAppsScript(data) {
    await fetch(gform.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });
  }

  function openSummaryModal(mode, summaryText) {
    if (!modal || !summaryOutput) return;
    summaryOutput.textContent = summaryText;

    if (mode === "live") {
      modalBadge.textContent = "Registration Submitted";
      modalTitle.textContent = "Your Team Is Registered!";
      modalSubtitle.textContent =
        "Your details have been sent to the IT Department registration sheet. Save a copy below for reference.";
    } else {
      modalBadge.textContent = "Preview Summary";
      modalTitle.textContent = "Registration Validated (Preview Mode)";
      modalSubtitle.textContent =
        "All team details look valid! To save live entries automatically, add your Google Form details in config.js.";
    }

    modal.hidden = false;
  }

  function resetCustomFormUI() {
    clearError();
    Object.keys(memberCache).forEach((k) => delete memberCache[k]);
    sizeButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-size") === "4"));
    if (teamSizeInput) teamSizeInput.value = "4";
    renderMemberBlocks(4);
    themeCards.forEach((c) => c.classList.remove("selected"));
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearError();

      const data = collectFormPayload();
      const validationError = validatePayload(data);
      if (validationError) {
        showError(validationError);
        return;
      }

      const originalLabel = submitBtn ? submitBtn.textContent : "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      try {
        if (hasDirectPost) {
          await submitToGoogleForm(data);
          openSummaryModal("live", formatSummaryText(data));
          form.reset();
          resetCustomFormUI();
        } else if (hasAppsScript) {
          await submitToAppsScript(data);
          openSummaryModal("live", formatSummaryText(data));
          form.reset();
          resetCustomFormUI();
        } else {
          openSummaryModal("preview", formatSummaryText(data));
        }
      } catch (err) {
        showError("Submission failed due to a network issue. Please try again or use the Google Form tab.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetCustomFormUI();
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.hidden = true;
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  if (copySummaryBtn && summaryOutput) {
    copySummaryBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(summaryOutput.textContent);
        copySummaryBtn.textContent = "Copied!";
        setTimeout(() => {
          copySummaryBtn.textContent = "Copy Details";
        }, 1800);
      } catch {
        copySummaryBtn.textContent = "Copy Failed";
      }
    });
  }
})();
