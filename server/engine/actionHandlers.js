const mustache = require("mustache");
const { createPost } = require("../controllers/linkedin/actions");
const {
  createFile,
  createFolder,
  appendTextToDocument,
  appendRowToSheet,
} = require("../controllers/google/actions");

const executeHandler = async (data, executionContext) => {
  const accountId = data.config.accountId;

  const renderWithFallback = (template, context) => {
    const renderedValue = mustache.render(template, context);
    return renderedValue !== "" ? renderedValue : template;
  };

  switch (data.service) {
    case "Google":
      switch (data.action) {
        case "CREATE_DOC" || "CREATE_SHEET":
          const filename = renderWithFallback(
            data.config.filename,
            executionContext
          );
          return await createFile(
            filename,
            data.config.fileType,
            data.config.folderId,
            accountId
          );
        case "CREATE_FOLDER":
          const folderName = renderWithFallback(
            data.config.folderName,
            executionContext
          );
          return await createFolder(
            folderName,
            data.config.folderId,
            accountId
          );
        case "APPEND_ROW":
          const values = data.config.values.map((value) => {
            return renderWithFallback(value, executionContext);
          });
          return await appendRowToSheet(
            data.config.spreadsheetId,
            data.config.sheetName,
            data.config.startRow,
            values,
            accountId
          );
        case "APPEND_TEXT":
          const text = renderWithFallback(data.config.text, executionContext);
          return await appendTextToDocument(
            data.config.documentId,
            text,
            accountId
          );

        default:
          break;
      }
      break;
    case "LinkedIn":
      switch (data.action) {
        case "CREATE_POST":
          const text = renderWithFallback(data.config.text, executionContext);
          return await createPost(text, accountId);
        default:
          break;
      }
    default:
      break;
  }
};

module.exports = { executeHandler };
