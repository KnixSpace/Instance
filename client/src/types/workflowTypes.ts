import { Edge, Node } from "@xyflow/react";

export interface WorkflowMetadata {
  name: string;
  description: string;
  userId: string;
  isActive: boolean;
}

export type SidePanelMode = "trigger" | "action" | "configuration" | null;

export interface workflowState {
  metadata: WorkflowMetadata;
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  sidePanel: SidePanelMode;
}
