const { google } = require("googleapis");
const { Google } = require("../../models/Google");
const { oauth2Client, isTokenExpired, updateTokens } = require("./config");

const sheets = google.sheets("v4");
const drive = google.drive("v3");

//drive services
async function getAllFiles(req, res) {
  try {
    const { accountId, pageToken, mimeType } = req.body;

    // Find the associated Google account
    const account = await Google.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "No Google account found" });
    }

    // Refresh token if expired
    let access_token = account.tokens.accessToken;
    if (isTokenExpired(account.tokens.expiry)) {
      const tokens = await updateTokens(account);
      access_token = tokens.access_token;
    }

    oauth2Client.setCredentials({ access_token });

    // Determine query based on mimeType
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
      default:
        return res.status(400).json({ message: "Invalid mimeType provided" });
    }

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Fetch files from Google Drive
    const response = await drive.files.list({
      pageSize: 10,
      pageToken: pageToken || null,
      q: query,
      fields: "nextPageToken, files(id, name)",
    });

    // Format the response options
    const options = response.data.files.map((file) => ({
      label: file.name,
      value: file.id,
    }));

    res.status(200).json({
      options,
      nextPageToken: response.data.nextPageToken || null,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      message: "An error occurred while fetching files",
      error: error.message,
    });
  }
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

async function getAllSpreadsheetSheets(req, res) {
  try {
    const { spreadsheetId, accountId } = req.body;

    if (!spreadsheetId || !accountId) {
      return res.status(400).json({ message: "Spreadsheet ID and Account ID are required" });
    }

    const account = await Google.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Google account not found" });
    }

    let access_token = account.tokens.accessToken;
    if (isTokenExpired(account.tokens.expiry)) {
      const tokens = await updateTokens(account);
      access_token = tokens.access_token;
    }

    oauth2Client.setCredentials({ access_token });

    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const response = await sheets.spreadsheets.get({ spreadsheetId });

    const options = response.data.sheets.map((sheet) => ({
      label: sheet.properties.title,
      value: sheet.properties.sheetId,
    }));

    res.status(200).json({ options });
  } catch (error) {
    console.error("Error fetching spreadsheet sheets:", error);

    // Handle specific errors
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    } else if (error.response?.status === 403) {
      return res.status(403).json({ message: "Access denied to the spreadsheet" });
    }

    // Generic error response
    res.status(500).json({
      message: "An error occurred while fetching spreadsheet sheets",
      error: error.message,
    });
  }
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

async function getNewEntryOfSheet(auth, spreadsheetId, range, lastProcessedRow) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (rows && rows.length > lastProcessedRow) {
      const newEntries = rows.slice(lastProcessedRow);
      return {
        newEntries,
        row: rows.length,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw new Error("Failed to retrieve new entries from the sheet");
  }
}

module.exports = {
  getDriveFiles,
  getFileMetadata,
  getSheetNames,
  getSheetData,
  getNewEntryOfSheet,
};
