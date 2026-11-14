/**
 * Tamiko website forms → Google Sheet + email alert.
 * Runs in the tamikotechnologies@gmail.com Google account.
 *
 * Setup (one time):
 * 1. Create a new Apps Script project named "Tamiko forms" and paste this whole file. Save.
 * 2. Run setup() once. It copies the old "Tamiko website leads" sheet into this account
 *    (or creates a fresh one), shares it with NOTIFY_EMAIL and remembers its ID.
 * 3. Deploy → New deployment → type "Web app"
 *      Execute as: Me      Who has access: Anyone
 *    Copy the Web app URL and paste it into site.js as FORM_ENDPOINT.
 */
const OLD_SHEET_ID = "1whDOrv2je3rJJuOl6iCIeWxx1sWlDwUPWWhi5dekNNk";
const NOTIFY_EMAIL = "admin@tamiko.club";

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

function setup() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty("SHEET_ID")) {
    Logger.log("Already set up: " + SpreadsheetApp.openById(props.getProperty("SHEET_ID")).getUrl());
    return;
  }
  let file;
  try {
    file = DriveApp.getFileById(OLD_SHEET_ID).makeCopy("Tamiko website leads");
  } catch (err) {
    file = DriveApp.getFileById(SpreadsheetApp.create("Tamiko website leads").getId());
  }
  file.addEditor(NOTIFY_EMAIL);
  props.setProperty("SHEET_ID", file.getId());
  Logger.log("Leads sheet: " + file.getUrl());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let data = {};
    try { data = JSON.parse(e.postData.contents); } catch (_) { data = e.parameter || {}; }
    const kind = TABS[data.form] ? data.form : "waitlist";
    const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SHEET_ID"));
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
