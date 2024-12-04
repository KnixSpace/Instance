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
    config?: Record<string, any>;
  };
  selected: boolean;
}

export interface  WorkflowState {
  name: string | null;
  description: string | null;
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  sidePanel: SidePanelMode;
  warning: {
    isWarning: boolean;
    message: string | null;
  };
  forwardList: {
    [key: string]: string[];
  };
  backwardList: { [key: string]: string[] };
}
