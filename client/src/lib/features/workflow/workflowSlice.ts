import { SidePanelMode, workflowState } from "@/types/workflowTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Edge, Node } from "@xyflow/react";

const initialState: workflowState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  sidePanel: "trigger",
  warning: {
    isWarning: false,
    message: null,
  },
  adjacencyList: {},
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

    selectNode: (state, action: PayloadAction<Node | null>) => {
      state.selectedNode = action.payload;
    },

    addNewEdge: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },

    setSidePanelMode: (state, action: PayloadAction<SidePanelMode>) => {
      state.sidePanel = action.payload;
    },

    setWarning: (
      state,
      action: PayloadAction<{ isWarning: boolean; message: string | null }>
    ) => {
      state.warning = action.payload;
    },

    setAdjacencyList: (state) => {
      const adjacencyList: { [key: string]: string[] } = {};

      for (let node of state.nodes) {
        adjacencyList[node.id] = [];
      }

      for (let edge of state.edges) {
        adjacencyList[edge.target].push(edge.source);
      }

      state.adjacencyList = adjacencyList;
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
  setWarning,
  setAdjacencyList,
} = workflowSlice.actions;

export default workflowSlice.reducer;
