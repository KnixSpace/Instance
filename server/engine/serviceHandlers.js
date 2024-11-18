const {
  createFile,
  createFolder,
  appendTextToDocument,
  appendRowToSheet,
} = require("../controllers/google/actions");

const executeHandler = async (data, executionContext) => {
  switch (data.service) {
    case "Google":
      switch (data.action) {
        case "createFile":
          //const MFilename = render(executionContext, data.config.filename);
          //const filename = MFilename !== "" ? MFliname: data.config.filename;
          return await createFile(
            // filename: data.config.filename
            // fileType : data.config.fileType
            // accountiD : data.config.accountId
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
