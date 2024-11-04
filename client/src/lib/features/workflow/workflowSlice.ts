import { SidePanelMode, workflowState } from "@/types/workflowTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Edge, Node } from "@xyflow/react";
import { a } from "framer-motion/client";

const initialState: workflowState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  sidePanel: "trigger",
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    initializedNewWorkflow: (state) => {
      return initialState;
    },

    initializedExistingWorkflow: (state, action: PayloadAction<any>) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      state.selectedNode = null;
      if (state.nodes.length > 0) {
        state.sidePanel = "configuration";
      } else {
        state.sidePanel = "trigger";
      }
    },

    addNewNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
      state.sidePanel = "configuration";
    },

    setDeletedNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },

    selectNode: (state, action: PayloadAction<string | null>) => {
      const isNode = state.nodes.find((node) => node.id === action.payload);
      state.selectedNode = isNode ? isNode : null;
    },

    addNewEdge: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },

    setSidePanelMode: (state, action: PayloadAction<SidePanelMode>) => {
      state.sidePanel = action.payload;
    },
  },
});

export const {
  initializedNewWorkflow,
  initializedExistingWorkflow,
  addNewNode,
  addNewEdge,
  selectNode,
  setDeletedNodes,
  setSidePanelMode,
} = workflowSlice.actions;

export default workflowSlice.reducer;
