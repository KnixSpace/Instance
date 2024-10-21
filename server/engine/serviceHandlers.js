import {
  appendRowToSheet,
  appendTextToDocument,
  createFile,
  createFolder,
} from "../controllers/google/actions";
import { postShare } from "../controllers/linkedin/actions";

export const serviceHandlers = {
  google: {
    createFolder,
    createFile,
    appendTextToDocument,
    appendRowToSheet,
  },
  linkedIn: {
    postShare,
  },
};
