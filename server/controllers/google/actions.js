const { google } = require("googleapis");
const { Google } = require("../../models/Google");
const { isTokenExpired, updateTokens, oauth2Client } = require("./config");

const drive = google.drive("v3");
const docs = google.docs("v1");
const sheets = google.sheets("v4");
const calendar = google.calendar("v3");

//drive actions
async function createFile(fileName, fileType, parentFolderId = null, accountId) {
  try {
    const account = await Google.findById(accountId);

    if (!account) {
      throw new Error("No Google account found");
    }

    let access_token = account.tokens.accessToken;

    // Validate and refresh token if needed
    if (isTokenExpired(account.tokens.expiry)) {
      const tokens = await updateTokens(account);
      access_token = tokens.access_token;
    }

    oauth2Client.setCredentials({ access_token });

    // Determine MIME type
    const mimeTypeMap = {
      docs: "application/vnd.google-apps.document",
      sheets: "application/vnd.google-apps.spreadsheet",
      slides: "application/vnd.google-apps.presentation",
    };

    const mimeType = mimeTypeMap[fileType.toLowerCase()];
    if (!mimeType) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    const fileMetadata = {
      name: fileName,
      mimeType,
      ...(parentFolderId && { parents: [parentFolderId] }), // Optional parent folder
    };

    const response = await drive.files.create({
      auth: oauth2Client,
      requestBody: fileMetadata,
      fields: "id, name, webViewLink",
    });

    return {
      status: true,
      data: {
        fileId: response.data.id,
        fileName: response.data.name,
        fileLink: response.data.webViewLink,
      },
    };
  } catch (error) {
    return {
      status: false,
      error: error.response ? error.response.data : error.message,
    };
  }
}

async function createFolder(folderName, parentFolderId = null, accountId) {
  try {
    const account = await Google.findById(accountId);

    if (!account) {
      throw new Error("No Google account found");
    }

    let access_token = account.tokens.accessToken;

    // Check token expiration
    if (isTokenExpired(account.tokens.expiry)) {
      const tokens = await updateTokens(account);
      access_token = tokens.access_token;
    }

    oauth2Client.setCredentials({ access_token });

    const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      ...(parentFolderId && { parents: [parentFolderId] }), // Optional parent folder
    };

    const response = await drive.files.create({
      auth: oauth2Client,
      requestBody: fileMetadata,
      fields: "id, name, webViewLink, parents",
    });

    return {
      status: true,
      data: {
        folderId: response.data.id,
        folderName: response.data.name,
        folderLink: response.data.webViewLink,
        folderPath: response.data.parents ? response.data.parents[0] : null,
      },
    };
  } catch (error) {
    return {
      status: false,
      error: error.response ? error.response.data : error.message,
    };
  }
}

//docs
async function appendTextToDocument(documentId, text, accountId) {
  try {
    const account = await Google.findById(accountId);

    if (!account) {
      throw new Error("No Google account found");
    }

    let access_token = account.tokens.accessToken;

    // Validate and refresh token if needed
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

    return {
      status: true,
      data: {
        documentId,
      },
    };
  } catch (error) {
    return {
      status: false,
      error: error.response ? error.response.data : error.message,
    };
  }
}

//sheets
async function appendRowToSheet(spreadsheetId, range, values, accountId) {
  try {
    const account = await Google.findById(accountId);

    if (!account) {
      throw new Error("No Google account found");
    }

    let access_token = account.tokens.accessToken;

    // Validate and refresh token if needed
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

    return {
      status: true,
      data: {
        spreadsheetId,
        updatedRange: response.data.updates.updatedRange,
        updatedRows: response.data.updates.updatedData.values,
      },
    };
  } catch (error) {
    return {
      status: false,
      error: error.response ? error.response.data : error.message,
    };
  }
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
