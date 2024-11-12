const {
  createFile,
  createFolder,
  appendTextToDocument,
  appendRowToSheet,
} = require("../controllers/google/actions");

const executeHandler = async (service, action, currentData, previousData) => {
  switch (service) {
    case "Google":
      switch (action) {
        case "createFile":
          return await createFile(
            previousData[currentData.fileName] || currentData.fileName,
            previousData[currentData.fileType] || currentData.fileType,
            currentData.userId,
            currentData.accountEmail
          );
        case "createFolder":
          return await createFolder(
            previousData.folderName,
            currentData.userId,
            currentData.accountEmail
          );
        case "appendRowToSheet":
          return await appendRowToSheet(
            currentData.spreadsheetId,
            currentData.range,
            previousData.values || currentData.values,
            currentData.userId,
            currentData.accountEmail
          );
        case "appendTextToDocument":
          return await appendTextToDocument(
            currentData.documentId,
            previousData.text || currentData.text,
            currentData.userId,
            currentData.accountEmail
          );

        default:
          break;
      }
      break;
    default:
      break;
  }
};

module.exports = { executeHandler };
