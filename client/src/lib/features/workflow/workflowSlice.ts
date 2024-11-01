import { SidePanelMode, workflowState } from "@/types/workflowTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Edge, Node } from "@xyflow/react";

const initialState: workflowState = {
  metadata: { name: "", description: "", userId: "", isActive: false },
  nodes: [],
  edges: [],
  selectedNode: null,
  sidePanel: "trigger",
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    addNewNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
      state.sidePanel = "configuration";
    },

    selectNode: (state, action: PayloadAction<string | null>) => {
      const isNode = state.nodes.find((node) => node.id === action.payload);
      state.selectedNode = isNode ? isNode : null;
    },

    addNewEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },

    setSidePanelMode: (state, action: PayloadAction<SidePanelMode>) => {
      state.sidePanel = action.payload;
    },
  },
});

export const { addNewNode, addNewEdge, selectNode, setSidePanelMode } =
  workflowSlice.actions;

export default workflowSlice.reducer;
