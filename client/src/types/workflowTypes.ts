import { Edge, Node } from "@xyflow/react";

export type SidePanelMode = "trigger" | "action" | "configuration" | null;

export interface workflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  sidePanel: SidePanelMode;
}