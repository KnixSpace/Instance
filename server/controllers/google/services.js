const { google } = require("googleapis");
const { Google } = require("../../models/Google");
const { oauth2Client, isTokenExpired, updateTokens } = require("./config");

const sheets = google.sheets("v4");
const drive = google.drive("v3");

//drive services
async function getAllDriveFiles(userId, email) {
  const account = await Google.findOne({ userId, email });

  if (!account) {
    throw new Error("No Google account found");
  }

  let access_token = account.tokens.accessToken;

  if (isTokenExpired(account.tokens.expiry)) {
    const tokens = await updateTokens(account);
    access_token = tokens.access_token;
  }

  oauth2Client.setCredentials({ access_token });

  const response = await drive.files.list({
    auth: oauth2Client,
    fields: "files(id, name, mimeType, webViewLink, modifiedTime)",
  });

  return response.data.files;
}

async function getFileMetadata(fileId, userId, email) {
  const account = await Google.findOne({ userId, email });

  if (!account) {
    throw new Error("No Google account found");
  }

  let access_token = account.tokens.accessToken;

  if (isTokenExpired(account.tokens.expiry)) {
    const tokens = await updateTokens(account);
    access_token = tokens.access_token;
  }

  oauth2Client.setCredentials({ access_token });

  const response = await drive.files.get({
    auth: oauth2Client,
    fileId,
    fields: "id, name, mimeType, size, webViewLink, modifiedTime",
  });

  return response.data;
}

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
  getAllDriveFiles,
  getFileMetadata,
  getAllSpreadsheet,
  getAllSpreadsheetSheets,
  getNewEntryOfSheet,
};
