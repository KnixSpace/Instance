const { google } = require("googleapis");
const {
  getAllSpreadsheet,
  getAllSpreadsheetSheets,
  getFileMetadata,
  getAllFiles,
} = require("../controllers/google/services");
const { oauth2Client } = require("../controllers/google/config");
const { createFile, createFolder } = require("../controllers/google/actions");

const router = require("express").Router();
let lastProcessedRow = 2;

router.post("/sheets", async (req, res) => {
  const { userId, accountEmail } = req.body;
  const response = await getAllSpreadsheet(userId, accountEmail);
  res.status(200).json(response);
});

router.post("/get", async (req, res) => {
  const { userId, spreadsheetId, accountEmail } = req.body;
  const response = await getAllSpreadsheetSheets(
    spreadsheetId,
    userId,
    accountEmail
  );
  res.status(200).json(response);
});

router.post("/files", async (req, res) => {
  const { userId, accountEmail, pageToken, mimeType } = req.body;
  const response = await getAllFiles(userId, accountEmail, pageToken, mimeType);
  res.status(200).json(response);
});

router.post("/data", async (req, res) => {
  const { fileId, userId, accountEmail } = req.body;
  const response = await getFileMetadata(fileId, userId, accountEmail);
  res.status(200).json(response);
});

router.post("/create/folder", async (req, res) => {
  const { folderName, userId, accountEmail } = req.body;
  const response = await createFolder(folderName, userId, accountEmail);
  res.status(200).json(response);
});

router.post("/create/file", async (req, res) => {
  const { fileName, fileType, userId, accountEmail } = req.body;
  const response = await createFile(fileName, fileType, userId, accountEmail);
  res.status(200).json(response);
});

router.post("/trigger", async (req, res) => {
  oauth2Client.setCredentials({ access_token: req.body.accessToken });

  const sheet = google.sheets({ version: "v4", auth: oauth2Client });

  const response = await sheet.spreadsheets.values.get({
    spreadsheetId: req.body.sheetId,
    range: "Sheet1!A1:Z",
  });

  // console.log("sheet data :", response.data);

  const rows = response.data.values;

  if (rows.length) {
    if (rows.length > lastProcessedRow) {
      console.log(lastProcessedRow);
      const newEntries = rows.slice(lastProcessedRow);
      lastProcessedRow = rows.length;
      console.log("new Entries", newEntries);
      console.log("rows :", lastProcessedRow);
    }
  }

  const ress = await sheet.spreadsheets.get({
    spreadsheetId: req.body.sheetId,
  });
  const { sheets } = ress.data;
  console.log(ress.data.sheets);

  res.json({
    data: response.data,
    count: response.data.values.length,
    sheets,
  });
});

module.exports = router;
