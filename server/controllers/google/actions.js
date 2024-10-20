const { google } = require("googleapis");
const { Google } = require("../../models/Google");
const { isTokenExpired, updateTokens, oauth2Client } = require("./config");

const drive = google.drive("v3");
const docs = google.docs("v1");
const sheets = google.sheets("v4");
const calendar = google.calendar("v3");

//drive actions
async function createFolder(folderName, userId, email) {
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

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  const response = await drive.files.create({
    auth: oauth2Client,
    requestBody: fileMetadata,
    fields: "id, name, webViewLink",
  });

  return response.data;
}

async function createFile(fileName, fileType, userId, email) {
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

  let mimeType = "";

  // Switch case for determining MIME type
  switch (fileType.toLowerCase()) {
    case "docs":
      mimeType = "application/vnd.google-apps.document";
      break;
    case "sheets":
      mimeType = "application/vnd.google-apps.spreadsheet";
      break;
    case "slides":
      mimeType = "application/vnd.google-apps.presentation";
      break;
    default:
      throw new Error("Unsupported file type!");
  }

  const fileMetadata = {
    name: fileName,
    mimeType,
  };

  try {
    const response = await drive.files.create({
      auth: oauth2Client,
      requestBody: fileMetadata,
      fields: "id, name, webViewLink",
    });

    return {
      id: response.data.id,
      name: response.data.name,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error("Error creating file:", error);
    throw new Error("Error creating file");
  }
}

//docs
async function appendTextToDocument(documentId, text, userId, email) {
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

  const response = await docs.documents.batchUpdate({
    documentId,
    auth: oauth2Client,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 }, // At the beginning of the document
            text,
          },
        },
      ],
    },
  });

  return response.data;
}

//sheets
async function appendRowToSheet(spreadsheetId, range, values, userId, email) {
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

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    auth: oauth2Client,
    requestBody: {
      majorDimension: "ROWS",
      values,
    },
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    includeValuesInResponse: true,
  });

  return response.data;
}

//gmail WIP
async function sendEmail(to, subject, body, userId, email) {
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
}

//calendars
async function createEvent(calendarId, eventDetails, userId, email) {
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

  const response = await calendar.events.insert({
    calendarId,
    auth: oauth2Client,
    requestBody: eventDetails,
  });

  return response.data;
}

module.exports = {
  createFolder,
  createFile,
  appendTextToDocument,
  appendRowToSheet,
};
