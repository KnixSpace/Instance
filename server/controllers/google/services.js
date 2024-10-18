const { google } = require("googleapis");
const { oauth2Client, isTokenExpired, updateTokens } = require("./config");
const { Google } = require("../../models/Google");

const sheets = google.sheets("v4");
const drive = google.drive("v3");

async function getAllSpreadsheet(userId, email) {
  const account = await Google.findOne({ userId, email });

  if (!account) {
    return res.status(404).send("No account found!!");
  }

  let access_token = account.tokens.accessToken;

  if (isTokenExpired(account.tokens.expiry)) {
    const tokens = await updateTokens(account);
    access_token = tokens.access_token;
  }
  oauth2Client.setCredentials({ access_token });

  const response = await drive.files.list({
    auth: oauth2Client,
    q: "mimeType='application/vnd.google-apps.spreadsheet'",
    fields: "files(id, name, webViewLink)",
  });

  return response.data.files;
}

async function getAllSpreadsheetSheets(spreadsheetId, userId, email) {
  const account = await Google.findOne({ userId, email });

  if (!account) {
    return res.status(404).send("No account found!!");
  }

  let access_token = account.tokens.accessToken;

  if (isTokenExpired(account.tokens.expiry)) {
    const tokens = await updateTokens(account);
    access_token = tokens.access_token;
  }

  oauth2Client.setCredentials({ access_token });

  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    auth: oauth2Client,
  });

  const payload = { sheets: response.data.sheets };
  return payload;
}

async function getNewEntryOfSheet(
  auth,
  spreadsheetId,
  range,
  lastProcessedRow
) {
  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  });

  const rows = response.data.values;

  if (rows.length) {
    if (rows.length > lastProcessedRow) {
      const newEntries = rows.slice(lastProcessedRow);
      lastProcessedRow = rows.length;
      const payload = {
        newEntries,
        lastProcessedRow,
      };
      return payload;
    }
  }
}

module.exports = {
  getAllSpreadsheet,
  getAllSpreadsheetSheets,
  getNewEntryOfSheet,
};
