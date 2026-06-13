const SPREADSHEET_ID = '1fxMMXXDq2agrcruCRbpk6i6FXGPLDvmF9lCyiGIyLf4';

function doPost(e) {
  try {
    // Handle preflight options request if necessary
    if (e.postData === undefined && Object.keys(e.parameter).length === 0) {
       return jsonResponse_({ ok: true, message: "CORS preflight" });
    }

    const payload = parsePayload_(e);
    const sheetKey = String(payload.sheet || '').toUpperCase();

    if (sheetKey !== 'RSVP' && sheetKey !== 'WISH') {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use sheet="RSVP" or sheet="WISH".' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, sheetKey);

    if (sheetKey === 'RSVP') {
      ensureHeaders_(sheet, ['Timestamp', 'Full Name', 'Guests', 'Dietary Notes']);
      sheet.appendRow([
        new Date(),
        payload.fullName || payload.name || '',
        payload.guests || '',
        payload.dietaryNotes || '',
      ]);
    } else {
      ensureHeaders_(sheet, ['Timestamp', 'Name', 'Message']);
      sheet.appendRow([
        new Date(),
        payload.name || '',
        payload.message || '',
      ]);
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Wedding form endpoint is running.',
  });
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};

  if (Object.keys(params).length > 0 && !e.postData) {
    return params;
  }

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) {
    return {};
  }

  if (contents.indexOf('=') !== -1 && contents.indexOf('{') !== 0) {
    return parseQueryString_(contents);
  }

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function parseQueryString_(query) {
  const out = {};
  const pairs = String(query).split('&');

  for (let i = 0; i < pairs.length; i++) {
    const part = pairs[i];
    if (!part) continue;

    const idx = part.indexOf('=');
    const rawKey = idx >= 0 ? part.slice(0, idx) : part;
    const rawValue = idx >= 0 ? part.slice(idx + 1) : '';
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    out[key] = value;
  }

  return out;
}

function getOrCreateSheet_(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
