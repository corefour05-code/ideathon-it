/**
 * Event & Google Form Configuration
 * -------------------------------------------------------------
 * Organizers (IT Dept, PSNACET) can update dates, contact info,
 * and Google Form links here without touching the main HTML/JS.
 */
const IDEATHON_CONFIG = {
  eventTitle: "IT Ideathon — 1st Year Edition",
  department: "Department of Information Technology",
  college: "PSNA College of Engineering and Technology",

  // Event schedule placeholders (update with your confirmed dates & venue)
  schedule: {
    registrationDeadline: "To Be Announced",
    ideathonDate: "November 21, 2026",
    venue: "Will intimate later",
  },

  /**
   * GOOGLE FORM INTEGRATION OPTIONS:
   *
   * Option A (Easiest — Recommended if you want zero setup):
   *   Paste your Google Form share link in `googleFormShareUrl`, and/or
   *   your iframe embed src URL in `googleFormEmbedUrl`.
   *   Example embed URL:
   *   "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?embedded=true"
   *
   * Option B (Custom UI -> Google Form backend):
   *   Keep the custom styled registration form on this page and send
   *   submissions straight into your Google Form's linked Google Sheet.
   *   Set `formActionUrl` to:
   *   "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"
   *   and fill in the matching `entry.xxxxxxx` field IDs below.
   *
   * Option C (Google Apps Script Web App):
   *   Set `appsScriptUrl` to your deployed Apps Script Web App URL
   *   to receive JSON payloads directly into a Google Sheet.
   */
  googleForm: {
    // Option A: Standard Google Form link / embed
    shareUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfIoxjx1m0_mDIoicIzRnAB9pxEtMgs2LzT9lRjFhV6pBq6aA/viewform",
    embedUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfIoxjx1m0_mDIoicIzRnAB9pxEtMgs2LzT9lRjFhV6pBq6aA/viewform?embedded=true",

    // Option B: Direct submission to Google Form endpoint
    formActionUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfIoxjx1m0_mDIoicIzRnAB9pxEtMgs2LzT9lRjFhV6pBq6aA/formResponse",
    entryIds: {
      teamName: "entry.2092238618",
      theme: "entry.1556369182",
      ideaTitle: "entry.479301265",
      teamSize: "entry.1753222212",

      leadName: "entry.588393791",
      leadRegNo: "entry.2109138769",
      leadSection: "entry.1102562889",
      leadPhone: "entry.1114732359",

      member2Name: "entry.1641563015",
      member2RegNo: "entry.913937522",
      member2Section: "entry.2028498792",

      member3Name: "entry.1236391038",
      member3RegNo: "entry.513203149",
      member3Section: "entry.415059540",

      member4Name: "entry.391958588",
      member4RegNo: "entry.1789632250",
      member4Section: "entry.1668498555",
    },

    // Option C: Optional Google Apps Script Web App URL
    appsScriptUrl: "",
  },
};

