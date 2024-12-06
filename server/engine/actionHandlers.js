const { createPost } = require("../controllers/linkedin/actions");
const { addContent } = require("../controllers/notion/action");
const { renderWithFallback } = require("../utils/renderValues");
const {
  createFile,
  createFolder,
  appendTextToDocument,
  appendRowToSheet,
} = require("../controllers/google/actions");

const executeHandler = async (data, executionContext) => {
  const accountId = data.authAccountInfo._id;
  const info = data.config;

  switch (data.service) {
    case "Google":
      return await handleGoogleActions(data.action, info, executionContext, accountId);
    case "LinkedIn":
      console.log("Entered linkedin");
      return await handleLinkedInActions(data.action, info, executionContext, accountId);
    case "Notion":
      return await handleNotionActions(data.action, info, executionContext, accountId);
    default:
      break;
  }
};

const handleGoogleActions = async (action, info, executionContext, accountId) => {
  switch (action) {
    case "CREATE_DOC":
    case "CREATE_SHEET":
      const filename = renderWithFallback(info.filename, executionContext);
      return await createFile(
        filename,
        info.fileType,
        info.folderId.value,
        accountId
      );
    case "CREATE_FOLDER":
      const folderName = renderWithFallback(info.folderName, executionContext);
      return await createFolder(
        folderName,
        info.parentFolderId.value,
        accountId
      );
    case "APPEND_ROW":
      const values = info.values.map((value) => {
        return renderWithFallback(value, executionContext);
      });
      return await appendRowToSheet(
        info.spreadsheetId,
        info.sheetName,
        info.startRow,
        values,
        accountId
      );
    case "APPEND_TEXT":
      const text = renderWithFallback(info.text, executionContext);
      return await appendTextToDocument(
        info.documentId.value,
        text,
        accountId
      );
    default:
      console.log("Entered default");
      break;
  }
}
const handleLinkedInActions = async (action, info, executionContext, accountId) => {
  switch (action) {
    
    case "CREATE_POST":
      const text = renderWithFallback(info.text, executionContext);
      return await createPost(text, accountId);
    default:
      break;
  }
};

const handleNotionActions = async (action, info, executionContext, accountId) => {
  switch (action) {
    case "ADD_CONTENT":
      const text = renderWithFallback(info.text, executionContext);
      return await addContent(info.pageId, text, accountId);
    default:
      break;
  }
}
module.exports = { executeHandler };
