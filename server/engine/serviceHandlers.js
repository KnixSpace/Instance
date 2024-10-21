import {
  appendRowToSheet,
  appendTextToDocument,
  createFile,
  createFolder,
} from "../controllers/google/actions";
import { postShare } from "../controllers/linkedin/actions";

export const getHanderData = (service, action, currentData, previousData) => {
  switch (service) {
    case "google":
      switch (action) {
        case "createFolder":
          return createFolder(
            previousData.folderName,
            currentData.userId,
            currentData.accountEmail
          );
        case "createFile":
          return createFile(
            previousData.fileName || currentData.fileName,
            previousData.fileName || currentData.fileName,
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
