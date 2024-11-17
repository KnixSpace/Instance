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
      action: "GIT_TRIGGER",
      description: "Triggered on your selected events",
      icon: appIcons.github,
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/github/integration/register`,
      },
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
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/integration/register`,
        scope: ["https://www.googleapis.com/auth/spreadsheets"],
      },
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
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/integration/register`,
        scope: ["https://www.googleapis.com/auth/drive"],
      },
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
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/integration/register`,
        scope: [
          "https://www.googleapis.com/auth/documents",
          "https://www.googleapis.com/auth/drive",
        ],
      },
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
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/integration/register`,
        scope: [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive",
        ],
      },
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
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/integration/register`,
        scope: ["https://www.googleapis.com/auth/spreadsheets"],
      },
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
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/integration/register`,
        scope: ["https://www.googleapis.com/auth/documents"],
      },
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
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/linkedin/integration/register`,
      },
    },
  },
];

export const actionConfig: ActionConfig[] = [
  {
    action: "GIT_TRIGGER",
    service: "Github",
    icon: appIcons.github,
    configFields: [
      {
        name: "event",
        label: "Event",
        type: "multiselect",
        placeholder: "Select events",
        isDynamic: false,
        options: [
          { label: "New Commit", value: "PUSH" },
          { label: "New Issue", value: "ISSUE" },
          { label: "New Pull Request", value: "PULL" },
        ],
        allowedCustomInput: false,
        validation: Yup.array()
          .min(1, "Select at least one event")
          .required("Event is required"),
      },

      {
        name: "repoName",
        label: "Repository Name",
        type: "select",
        placeholder: "Select a repository",
        isDynamic: true,
        dynamicOptions: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/github/repos`,
        },
        allowedCustomInput: false,
        validation: Yup.object().required("Repository Name is required"),
      },
    ],
    outputFields: ["commitId", "commitMessage", "commitLink", "repoName"],
  },
  {
    action: "SHEET_NEW_ENTRY",
    service: "Google",
    icon: appIcons.sheets,
    configFields: [
      {
        name: "spreadsheetId",
        label: "Sheet",
        type: "select",
        placeholder: "Select a sheet",
        isDynamic: true,
        dynamicOptions: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/service/getDriveFiles`,
          body: {
            mimeType: "sheets",
          },
        },
        allowedCustomInput: false,
        validation: Yup.object().required("Sheet is required"),
      },
      {
        name: "sheetName",
        label: "Sheet Name",
        type: "select",
        placeholder: "Select a sheet name",
        isDynamic: true,
        dynamicOptions: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/service/getSheetNames`,
        },
        dependentOn: ["spreadsheetId"],
        allowedCustomInput: false,
        validation: Yup.object().required("Sheet Name is required"),
      },
      {
        name: "range",
        label: "Range",
        type: "text",
        placeholder: "Enter range A1:Z100",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.string()
          .required("Range is required")
          .matches(/^[A-Za-z0-9_!]+$/, "Invalid range"),
      },
    ],
    outputFields: ["newEntry", "sheetId", "sheetLink"],
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
        validation: Yup.object().required("Filename is required"),
      },
      {
        name: "folderId",
        label: "Folder",
        type: "select",
        placeholder: "Select a folder",
        isDynamic: true,
        dynamicOptions: {
          url: "https://drive.googleapis.com/v3/files",
        },
        allowedCustomInput: false,
        validation: Yup.object(),
      },
    ],
    outputFields: ["docId", "docLink", "docTitle"],
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
        validation: Yup.object().required("Filename is required"),
      },
      // {
      //   name: "folderId",
      //   label: "Folder",
      //   type: "select",
      //   placeholder: "Select a folder",
      //   isDynamic: true,
      //   dynamicOptions: {
      //     url: "https://drive.googleapis.com/v3/files",
      //   },
      //   allowedCustomInput: false,
      //   validation: Yup.object(),
      // },
    ],
    outputFields: ["sheetId", "sheetLink", "sheetTitle"],
  },
  {
    action: "APPEND_ROW",
    service: "Google",
    icon: appIcons.sheets,
    configFields: [
      {
        name: "sheetId",
        label: "Sheet",
        type: "select",
        placeholder: "Select a sheet",
        isDynamic: true,
        dynamicOptions: {
          url: "https://sheets.googleapis.com/v4/spreadsheets",
        },
        allowedCustomInput: false,
        validation: Yup.object().required("Sheet is required"),
      },
      {
        name: "sheetName",
        label: "Sheet Name",
        type: "select",
        placeholder: "Select a sheet name",
        isDynamic: true,
        dynamicOptions: {
          url: "https://sheets.googleapis.com/v4/spreadsheets",
        },
        dependentOn: ["sheetId"],
        allowedCustomInput: false,
        validation: Yup.object().required("Sheet Name is required"),
      },
      {
        name: "range",
        label: "Range",
        type: "text",
        placeholder: "Enter range !A1:Z100",
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
    outputFields: ["updatedSheet", "sheetId", "sheetLink"],
  },
  {
    action: "APPEND_TEXT",
    service: "Google",
    icon: appIcons.docs,
    configFields: [
      {
        name: "docId",
        label: "Doc",
        type: "select",
        placeholder: "Select a document",
        isDynamic: true,
        dynamicOptions: {
          url: "https://drive.googleapis.com/v3/files",
        },
        allowedCustomInput: false,
        validation: Yup.object().required("Document is required"),
      },
      {
        name: "text",
        label: "Text",
        type: "select",
        placeholder: "Select a text",
        isDynamic: false,
        allowedCustomInput: true,
        validation: Yup.object().required("Text is required"),
      },
    ],
    outputFields: ["updatedDoc", "docId", "docLink"],
  },
];
