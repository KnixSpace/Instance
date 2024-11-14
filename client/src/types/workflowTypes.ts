import { Edge } from "@xyflow/react";

export type SidePanelMode =
  | "trigger"
  | "action"
  | "configuration"
  | "account"
  | null;

export interface Account {
  url?: string;
  scope?: string[];
  _id: string;
  name: string;
  avatar: string;
  email: string;
  userId: string;
}

export interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    triggerType: string;
    service: string;
    action: string;
    description: string;
    icon: string;
    authAccountInfo: Account;
  };
  selected: boolean;
}

export interface workflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  sidePanel: SidePanelMode;
  warning: {
    isWarning: boolean;
    message: string | null;
  };
  adjacencyList: {
    [key: string]: string[];
  };
}
