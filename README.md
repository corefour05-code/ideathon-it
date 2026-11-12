# IT Ideathon — 1st Year Edition (PSNA College of Engineering and Technology)

Event details and team registration page for the **Department of Information Technology, PSNA College of Engineering and Technology**.

## Files

- `index.html` — Main event & registration page (Hero, Themes, Rules, Timeline, Registration, FAQ).
- `styles.css` — Responsive dark-mode layout and styling.
- `config.js` — Single file for organizers to update event dates, venue, and Google Form settings.
- `script.js` — Theme selection, dynamic team member fields (max 4 members), validation, and Google Form submission logic.

## Can We Use Google Forms (gForm)?

**Yes!** You have two easy ways to use Google Forms with this page, configured inside `config.js`:

### Option 1: Embed or Link Your Google Form (Easiest — 1 Minute Setup)
1. Create a Google Form with fields for Team Name, Theme, Team Lead (Name, Register No, Section, Phone, Email), and Members 2–4 (Name, Register No, Section).
2. Click **Send** -> **Embed HTML (`<>`)** and copy the `src` URL (it ends with `?embedded=true`).
3. Paste that URL into `embedUrl` (and optionally the normal share link into `shareUrl`) inside `config.js`.
4. Students can use the **"Google Form (Embed / Direct Link)"** tab directly on the page.

### Option 2: Keep the Custom Form UI & Save Directly to Google Forms / Google Sheets
1. Create your Google Form (use **Short Answer** fields for all inputs, or **Dropdown** with matching theme names).
2. Open the Google Form -> click the **3-dot menu** -> **Get pre-filled link**.
3. Fill sample values into every field, click **Get Link**, and inspect the URL parameters (`entry.123456789=...`).
4. In `config.js`:
   - Set `formActionUrl` to `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`
   - Paste each `entry.xxxxxxxxx` ID into `entryIds`.
5. Make sure **"Limit to 1 response"** and **"Collect email addresses (Verified)"** are turned **OFF** in Google Form settings so `formResponse` accepts unauthenticated browser submissions cleanly.
6. Link your Google Form to a **Google Sheet** under the **Responses** tab to view all team registrations live.

