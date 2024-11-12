const { google } = require("googleapis");
const { Google } = require("../../models/Google");
const { oauth2Client, isTokenExpired, updateTokens } = require("./config");

const sheets = google.sheets("v4");
const drive = google.drive("v3");

//drive services
async function getAllFiles(userId, email, pageToken, mimeType) {
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

  let query = "";

  switch (mimeType) {
    case "docs":
      query = "mimeType='application/vnd.google-apps.document'";
      break;
    case "sheets":
      query = "mimeType='application/vnd.google-apps.spreadsheet'";
      break;
    case "folders":
      query = "mimeType='application/vnd.google-apps.folder'";
      break;
  }

  console.log(query);

  const response = await drive.files.list({
    auth: oauth2Client,
    pageSize: 10,
    pageToken: pageToken || null,
    q: query,
  });

  return response.data;
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
    fields:
      "kind, id, name, mimeType, webViewLink, owners, ownedByMe, permissions",
  });

  return response.data;
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

async function getSheetData(spreadsheetId, range, userId, email) {
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

  const response = await sheets.spreadsheets.values.get({
    auth: oauth2Client,
    spreadsheetId,
    range,
  });

  return response.data.values;
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
        row: rows.length,
      };
      return payload;
    }
  } else {
    return null;
  }
}

module.exports = {
  getAllFiles,
  getFileMetadata,
  getAllSpreadsheetSheets,
  getSheetData,
  getNewEntryOfSheet,
};
