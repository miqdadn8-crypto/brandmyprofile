/**
 * BrandMyProfile - lead intake (Google Apps Script web app).
 * NOT DEPLOYED. Setup instructions: integrations/google-apps-script/README.md
 *
 * Receives a JSON POST from the website's /api/lead endpoint (never from the browser),
 * then: de-duplicates, stores the CV in a private Drive folder, appends a row to a private
 * Sheet and emails the notification.
 *
 * Script Properties required (Project Settings > Script properties):
 *   LEAD_SECRET      shared secret (must equal LEAD_APPS_SCRIPT_SECRET on Vercel)
 *   SHEET_ID         id of the private Google Sheet
 *   DRIVE_FOLDER_ID  id of the private Drive folder for CV uploads
 *   NOTIFY_EMAIL     optional; defaults to miqdadn2@gmail.com
 */

var SHEET_NAME = 'Leads';
var HEADERS = [
  'Timestamp', 'Lead ID', 'Name', 'Email', 'WhatsApp', 'Target Role', 'Target Country',
  'Service Interest', 'Region', 'Source Page', 'Lead Trigger', 'UTM Source', 'UTM Medium',
  'UTM Campaign', 'Referrer', 'CV File URL', 'Status', 'Notes', 'UTM Content'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var props = PropertiesService.getScriptProperties();
    var data = JSON.parse(e.postData.contents);

    if (!data || data.secret !== props.getProperty('LEAD_SECRET')) {
      return respond_({ ok: false, error: 'unauthorized' });
    }

    var sheet = getSheet_(props.getProperty('SHEET_ID'));

    // Duplicate rule: same normalized WhatsApp (or same email) AND same service within the window.
    var existing = findRecentDuplicate_(sheet, data);
    if (existing) {
      return respond_({ ok: true, duplicate: true, leadId: existing });
    }

    var fileUrl = '';
    if (data.file && data.file.base64) {
      var folder = DriveApp.getFolderById(props.getProperty('DRIVE_FOLDER_ID'));
      var blob = Utilities.newBlob(Utilities.base64Decode(data.file.base64), data.file.mime, data.leadId + '_' + data.file.name);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
      fileUrl = file.getUrl();
    }

    // Column order follows HEADERS. cell_() neutralises spreadsheet-formula injection.
    sheet.appendRow([
      cell_(data.timestamp), cell_(data.leadId), cell_(data.name), cell_(data.email), cell_(data.whatsapp),
      cell_(data.targetRole), cell_(data.targetCountry), cell_(data.service), cell_(data.region),
      cell_(data.sourcePage), cell_(data.trigger), cell_(data.utmSource), cell_(data.utmMedium),
      cell_(data.utmCampaign), cell_(data.referrer), fileUrl, 'New', '', cell_(data.utmContent)
    ]);

    // The lead is saved at this point. An email failure must not make the website report failure.
    try {
      sendNotification_(props.getProperty('NOTIFY_EMAIL') || 'miqdadn2@gmail.com', data, fileUrl);
    } catch (mailError) {
      console.error('Notification failed: ' + mailError);
    }

    return respond_({ ok: true, leadId: data.leadId });
  } catch (err) {
    console.error('Lead intake error: ' + err);
    return respond_({ ok: false, error: 'server_error' });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function getSheet_(sheetId) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRecentDuplicate_(sheet, data) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  var start = Math.max(2, lastRow - 199);
  var rows = sheet.getRange(start, 1, lastRow - start + 1, 8).getValues(); // columns A..H
  var windowMs = data.duplicateWindowMs || 600000;
  var now = new Date(data.timestamp).getTime();
  var phone = digits_(data.whatsapp);
  var email = String(data.email || '').toLowerCase();
  for (var i = rows.length - 1; i >= 0; i--) {
    var r = rows[i];
    var t = new Date(r[0]).getTime();
    if (isNaN(t) || now - t > windowMs) continue;
    var sameService = String(r[7]) === data.service;
    var samePhone = phone && digits_(r[4]) === phone;
    var sameEmail = email && String(r[3]).toLowerCase() === email;
    if (sameService && (samePhone || sameEmail)) return String(r[1]);
  }
  return null;
}

function digits_(value) { return String(value || '').replace(/\D/g, ''); }

// A leading = + - @ would be interpreted as a formula by Sheets.
function cell_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function sendNotification_(to, d, fileUrl) {
  var subject = 'New BrandMyProfile Lead - ' + d.service + ' - ' + d.targetCountry;
  var lines = [
    'Lead ID: ' + d.leadId,
    'Timestamp: ' + d.timestamp,
    'Name: ' + d.name,
    'Email: ' + (d.email || '(not provided)'),
    'WhatsApp: ' + d.whatsapp,
    'Target Role: ' + d.targetRole,
    'Target Country: ' + d.targetCountry,
    'Service: ' + d.service,
    'Source Page: ' + d.sourcePage,
    'Lead Trigger: ' + d.trigger,
    'CV: ' + (fileUrl || '(none uploaded)')
  ];
  MailApp.sendEmail({ to: to, subject: subject, body: lines.join('\n') });
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
