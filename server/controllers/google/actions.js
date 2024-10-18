const { google } = require("googleapis");
const { Google } = require("../../models/Google");
const { isTokenExpired, updateTokens, oauth2Client } = require("./config");

const drive = google.drive("v3");

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
    case "doc":
      mimeType = "application/vnd.google-apps.document";
      break;
    case "sheet":
      mimeType = "application/vnd.google-apps.spreadsheet";
      break;
    case "slide":
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

module.exports = { createFolder, createFile };
