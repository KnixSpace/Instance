import * as Yup from "yup";
import { appIcons } from "@/lib/constants";
import { ActionConfig } from "@/types/configurationTypes";
import { SiSlack } from "react-icons/si";
import { label } from "framer-motion/client";

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
      triggerType: "scheduler",
      service: "Google",
      action: "SHEET_NEW_ENTRY",
      description: "Triggered when new entry in a sheet",
      icon: appIcons.sheets,
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/integration/register`,
        scope: [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive",
        ],
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
      action: "CREATE_POST",
      description: "Share a post on LinkedIn",
      icon: appIcons.linkedin,
      authAccountInfo: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/linkedin/integration/register`,
      },
    },
  },
  {
    type:"action",
    data:{
      label:"Notion",
      service:"Notion",
      action:"ADD_CONTENT",
      description:"Add Contnent to page",
      icon: appIcons.meet,
      authAccountInfo:{
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/notion/integration/register`,
      }

    }
  },
    {
      type:"action",
      data:{
        label:"Slack",
        service:"Slack",
        action:"CREATE_CHANNEL",
        description:"Create your channel on Slack",
        icon: appIcons.meet, 
        authAccountInfo:{
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/slack/integration/register`,
       }
      }
    }
  
];

export const actionConfig: ActionConfig[] = [
  {
    action: "GIT_TRIGGER",
    service: "Github",
    icon: appIcons.github,
    configFields: [
      {
        name: "events",
        label: "Events",
        type: "multi-select",
        placeholder: "Select events",
        isDynamic: false,
        options: [
          { label: "New Commit", value: "push" },
          { label: "New Issue", value: "issue" },
          { label: "New Pull Request", value: "pull" },
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
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/github/service/getRepos`,
        },
        allowedCustomInput: false,
        validation: Yup.object().required("Repository Name is required"),
      },
    ],
    outputFields: [
      { label: "Repo id", value: "repository.id" },
      { label: "Repo name", value: "repository.name" },
      { label: "Repo url", value: "repository.url" },
      { label: "Commit id", value: "commit.id" },
      { label: "Commit message", value: "commit.message" },
      { label: "Commit url", value: "commit.url" },
      { label: "Modified files", value: "commit.modifiedFiles" },
    ],
  },
  {
    action: "SHEET_NEW_ENTRY",
    service: "Google",
    icon: appIcons.sheets,
    configFields: [
      {
        name: "spreadsheetId",
        label: "Spreadsheet",
        type: "select",
        placeholder: "Select a spreadsheet",
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
        name: "lastProcessedRow",
        label: "Start Row",
        type: "number",
        placeholder: "Select a start row to track new entries",
        isDynamic: false,
        allowedCustomInput: false,
        validation: Yup.number()
          .required("Start Row is required")
          .min(1, "Start Row should be greater than 0")
          .max(1000, "Start Row should be less than 1000"),
      },
    ],
    outputFields: [
      { label: "Sheet Id", value: "spreadsheetId" },
      { label: "Sheet Name", value: "sheetName" },
      { label: "New Entry", value: "newEntry" },
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
        validation: Yup.object().required("Filename is required"),
      },
      {
        name: "folderId",
        label: "Folder",
        type: "select",
        placeholder: "Select a folder",
        isDynamic: true,
        dynamicOptions: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/service/getDriveFiles`,
          body: {
            mimeType: "folders",
          },
        },
        allowedCustomInput: false,
        validation: Yup.object(),
      },
    ],
    outputFields: [
      { label: "File id", value: "fileId" },
      { label: "File link", value: "fileLink" },
      { label: "File Name", value: "fileName" },
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
        validation: Yup.object().required("Filename is required"),
      },
      {
        name: "folderId",
        label: "Folder",
        type: "select",
        placeholder: "Select a folder",
        isDynamic: true,
        dynamicOptions: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/service/getDriveFiles`,
          body: {
            mimeType: "folders",
          },
        },
        allowedCustomInput: false,
        validation: Yup.object(),
      },
    ],
    outputFields: [
      { label: "Sheet id", value: "fileId" },
      { label: "Sheet link", value: "fileLink" },
      { label: "Sheet Name", value: "fileName" },
    ],
  },
  {
    action: "APPEND_ROW",
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
        name: "startRow",
        label: "Starting row to append",
        type: "number",
        placeholder: "Select a start row to append values",
        isDynamic: false,
        allowedCustomInput: false,
        validation: Yup.number()
          .required("Start Row is required")
          .min(1, "Start Row should be greater than 0")
          .max(1000, "Start Row should be less than 1000"),
      },
      {
        name: "values",
        label: "Values",
        type: "multi-select",
        placeholder: "Select values to append",
        isDynamic: false,
        allowedCustomInput: false,
        validation: Yup.array()
          .min(1, "Select at least one event")
          .required("Values are required"),
      },
    ],
    outputFields: [
      { label: "Sheet id", value: "spreadsheetId" },
      { label: "Updated rows", value: "updatedRows" },
    ],
  },
  {
    action: "APPEND_TEXT",
    service: "Google",
    icon: appIcons.docs,
    configFields: [
      {
        name: "documentId",
        label: "Doc",
        type: "select",
        placeholder: "Select a document",
        isDynamic: true,
        dynamicOptions: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/google/service/getSheetNames`,
          body: {
            mimeType: "docs",
          },
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
    outputFields: [{ label: "Document id", value: "documentId" }],
  },
  {
    action: "SHARE_POST",
    service:"Linkedin",
    icon:appIcons.linkedin,
    configFields:[
      {
        name:"text",
        label:"Text Data",
        type:"text",
        placeholder:"Enter text to post on linkedin",
        isDynamic:true,
        allowedCustomInput:true,
        validation:Yup.string().required("text is required")
      }
    ],
    outputFields:["text"] 
  }, 
  {
    action: "ADD_CONTENT",
    service:"Notion",
    icon:appIcons.meet,
    configFields:[
      {
        name:"text",
        label:"Content",
        type:"select",
        placeholder:"Enter content to add on notion page",
        isDynamic:false,
        allowedCustomInput:true,
        validation:Yup.string().required("text is required")
      }
    ],
    outputFields:["text"] 
  }, 
  {
    action: "CREATE_CHANNEL",
    service:"Slack",
    icon:appIcons.meet,
    configFields:[
      {
        name:"channelName",
        label:"Chanel Name",
        type:"text", 
        placeholder:"Enter Your Chanel Name",
        isDynamic:false,
        allowedCustomInput:true,
        validation:Yup.string().required("text is required")
      },{
        name:"isPrivate",
        label:"Chanel Name",
        type:"boolean", 
        placeholder:"Enter Your Chanel Name",
        isDynamic:false,
        allowedCustomInput:true,
        validation:Yup.string().required("text is required")
      }
    ],
    outputFields:["text"]
  }
  
];
