/**
 * Tamiko website forms → Google Sheet + email alert.
 *
 * Setup (one time):
 * 1. Create a new Apps Script project (script.new) named "Tamiko forms".
 * 2. Paste this whole file. SHEET_ID is the Google Sheet "Tamiko website leads". Save.
 * 3. Deploy → New deployment → type "Web app"
 *      Execute as: Me      Who has access: Anyone
 *    Copy the Web app URL and paste it into site.js as FORM_ENDPOINT.
 */
const SHEET_ID = "1whDOrv2je3rJJuOl6iCIeWxx1sWlDwUPWWhi5dekNNk";
const NOTIFY_EMAIL = "priyanshu.dp18@gmail.com";

const TABS = {
  waitlist: ["Received at", "Name", "Phone", "Email", "Area", "Interests", "Brands", "Source"],
  expert:   ["Received at", "Name", "Phone", "Email", "Area", "Experience", "Speciality", "Source"],
  brand:    ["Received at", "Brand", "Name", "Email", "Phone", "Categories", "Message", "Source"],
};
const FIELDS = {
  waitlist: ["at", "name", "phone", "email", "area", "interests", "brands", "source"],
  expert:   ["at", "name", "phone", "email", "area", "experience", "speciality", "source"],
  brand:    ["at", "brand", "name", "email", "phone", "categories", "message", "source"],
};
const TITLES = { waitlist: "Tamiko Club signups", expert: "Expert applications", brand: "Brand enquiries" };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let data = {};
    try { data = JSON.parse(e.postData.contents); } catch (_) { data = e.parameter || {}; }
    const kind = TABS[data.form] ? data.form : "waitlist";
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sh = ss.getSheetByName(TITLES[kind]);
    if (!sh) {
      sh = ss.insertSheet(TITLES[kind]);
      sh.appendRow(TABS[kind]);
      sh.getRange(1, 1, 1, TABS[kind].length).setFontWeight("bold").setBackground("#F5D7E0");
      sh.setFrozenRows(1);
    }
    const clean = (v) => String(v == null ? "" : v).slice(0, 2000).replace(/^[=+\-@]/, "'$&");
    const row = FIELDS[kind].map((k) => (k === "at" ? Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") : clean(data[k])));
    sh.appendRow(row);

    const lines = TABS[kind].map((h, i) => `${h}: ${row[i]}`).join("\n");
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New ${TITLES[kind].replace(/s$/, "")}: ${data.name || data.brand || "website form"}`,
      body: `${lines}\n\nAll entries: ${ss.getUrl()}`,
    });
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("Tamiko forms endpoint is running.");
}
