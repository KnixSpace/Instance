import * as Yup from "yup";
import { appIcons } from "@/lib/constants";
import { ActionConfig } from "@/types/configurationTypes";

export const workflowNodesConfig = [
  {
    type: "trigger",
    data: {
      label: "Github",
      triggerType: "automatic",
      service: "Github",
      action: "NEW_COMMIT",
      description: "Triggered when a new commit is made",
      icon: appIcons.github,
    },
  },
  {
    type: "trigger",
    data: {
      label: "Sheets",
      triggerType: "scheduled",
      service: "Google",
      action: "SHEET_NEW_ENTRY",
      description: "Triggered when new entry in a sheet",
      icon: appIcons.sheets,
    },
  },
  {
    type: "action",
    data: {
      label: "Drive",
      service: "Google",
      action: "CREATE_FOLDER",
      description: "Create a new folder",
      icon: appIcons.drive,
    },
  },
  {
    type: "action",
    data: {
      label: "Docs",
      service: "Google",
      action: "CREATE_DOC",
      description: "Create a new document",
      icon: appIcons.docs,
      config: {
        fileType: "docs",
      },
    },
  },
  {
    type: "action",
    data: {
      label: "Sheets",
      service: "Google",
      action: "CREATE_SHEET",
      description: "Create a new sheet",
      icon: appIcons.sheets,
      config: {
        fileType: "sheets",
      },
    },
  },
  {
    type: "action",
    data: {
      label: "Sheets",
      service: "Google",
      action: "APPEND_ROW",
      description: "Append a row to a sheet",
      icon: appIcons.sheets,
    },
  },
  {
    type: "action",
    data: {
      label: "Docs",
      service: "Google",
      action: "APPEND_TEXT",
      description: "Append text to a document",
      icon: appIcons.docs,
    },
  },
  {
    type: "action",
    data: {
      label: "LinkedIn",
      service: "LinkedIn",
      action: "SHARE_POST",
      description: "Share a post on LinkedIn",
      icon: appIcons.linkedin,
    },
  },
];

export const actionConfig: ActionConfig[] = [
  {
    action: "NEW_COMMIT",
    service: "Github",
    icon: appIcons.github,
    configFields: [
      {
        name: "repoName",
        label: "Repository Name",
        type: "select",
        placeholder: "Select a repository",
        isDynamic: true,
        dynamicOptions: {
          url: "https://api.github.com/user/repos",
          headers: {}, // Add headers if required
        },
        allowedCustomInput: false,
        validation: Yup.string().required("Repository Name is required"),
      },
      {
        name: "event",
        label: "Event",
        type: "select",
        placeholder: "Select an event",
        isDynamic: false,
        options: [
          { label: "New Commit", value: "NEW_COMMIT" },
          { label: "New Issue", value: "NEW_ISSUE" },
          { label: "New Pull Request", value: "NEW_PULL_REQUEST" },
        ],
        allowedCustomInput: false,
        validation: Yup.string().required("Event is required"),
      },
    ],
    outputFields: [
      {
        name: "commitId",
        icon: appIcons.github,
      },
      {
        name: "commitMessage",
        icon: appIcons.github,
      },
      {
        name: "commitAuthor",
        icon: appIcons.github,
      },
    ],
  },
  {
    action: "SHEET_NEW_ENTRY",
    service: "Google",
    icon: appIcons.sheets,
    configFields: [
      {
        name: "sheetId",
        label: "Sheet ID",
        type: "select",
        placeholder: "Select a sheet",
        isDynamic: true,
        dynamicOptions: {
          url: "https://sheets.googleapis.com/v4/spreadsheets",
          headers: {},
        },
        allowedCustomInput: false,
        validation: Yup.string().required("Sheet ID is required"),
      },
      {
        name: "range",
        label: "Range",
        type: "text",
        placeholder: "Enter range SHEET_NAME!A1:Z100",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.string()
          .required("Range is required")
          .matches(/^[A-Za-z0-9_!]+$/, "Invalid range"),
      },
    ],
    outputFields: [
      {
        name: "values",
        icon: appIcons.sheets,
      },
      {
        name: "sheet link",
        icon: appIcons.sheets,
      },
    ],
  },
  {
    action: "CREATE_DOC",
    service: "Google",
    icon: appIcons.docs,
    configFields: [
      {
        name: "filename",
        label: "Filename",
        type: "select",
        placeholder: "Select a filename",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.string()
          .trim()
          .required("Filename is required")
          .min(3, "Filename must be at least 3 characters"),
      },
      {
        name: "folderId",
        label: "Folder ID",
        type: "select",
        placeholder: "Select a folder",
        isDynamic: true,
        dynamicOptions: {
          url: "https://drive.googleapis.com/v3/files",
          headers: {},
        },
        allowedCustomInput: false,
        validation: Yup.string(),
      },
    ],
    outputFields: [
      {
        name: "docId",
        icon: appIcons.docs,
      },
      {
        name: "doc link",
        icon: appIcons.docs,
      },
    ],
  },
  {
    action: "CREATE_SHEET",
    service: "Google",
    icon: appIcons.sheets,
    configFields: [
      {
        name: "filename",
        label: "Filename",
        type: "select",
        placeholder: "Select a filename",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.string()
          .trim()
          .required("Filename is required")
          .min(3, "Filename must be at least 3 characters"),
      },
      {
        name: "folderId",
        label: "Folder ID",
        type: "select",
        placeholder: "Select a folder",
        isDynamic: true,
        dynamicOptions: {
          url: "https://drive.googleapis.com/v3/files",
          headers: {},
        },
        allowedCustomInput: false,
        validation: Yup.string(),
      },
    ],
    outputFields: [
      {
        name: "sheetId",
        icon: appIcons.sheets,
      },
      {
        name: "sheet link",
        icon: appIcons.sheets,
      },
    ],
  },
  {
    action: "APPEND_ROW",
    service: "Google",
    icon: appIcons.sheets,
    configFields: [
      {
        name: "sheetId",
        label: "Sheet ID",
        type: "select",
        placeholder: "Select a sheet",
        isDynamic: true,
        dynamicOptions: {
          url: "https://sheets.googleapis.com/v4/spreadsheets",
          headers: {},
        },
        allowedCustomInput: false,
        validation: Yup.string().required("Sheet ID is required"),
      },
      {
        name: "range",
        label: "Range",
        type: "text",
        placeholder: "Enter range SHEET_NAME!A1:Z100",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.string()
          .required("Range is required")
          .matches(/^[A-Za-z0-9_!]+$/, "Invalid range"),
      },
      {
        name: "values",
        label: "Values",
        type: "text",
        placeholder: "Enter values",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.string().required("Values are required"),
      },
    ],
    outputFields: [
      {
        name: "updatedRange",
        icon: appIcons.sheets,
      },
      {
        name: "updatedValues",
        icon: appIcons.sheets,
      },
    ],
  },
  {
    action: "APPEND_TEXT",
    service: "Google",
    icon: appIcons.docs,
    configFields: [
      {
        name: "docId",
        label: "Doc ID",
        type: "select",
        placeholder: "Select a document",
        isDynamic: true,
        dynamicOptions: {
          url: "https://drive.googleapis.com/v3/files",
          headers: {},
        },
        allowedCustomInput: false,
        validation: Yup.string().required("Doc ID is required"),
      },
      {
        name: "text",
        label: "Text",
        type: "select",
        placeholder: "Select a text",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.string().required("Text is required"),
      },
    ],
    outputFields: [
      {
        name: "updatedText",
        icon: appIcons.docs,
      },
    ],
  },
];
