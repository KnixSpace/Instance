import {
  Account,
  Node,
  SidePanelMode,
  workflowState,
} from "@/types/workflowTypes";
import { createAdjacencyList, getNextNodes } from "@/utils/workflowUtils";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Edge } from "@xyflow/react";

const initialState: workflowState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  sidePanel: "trigger",
  warning: {
    isWarning: false,
    message: null,
  },
  forwardList: {},
  backwardList: {},
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

    setDeletedNodes: (state, action: PayloadAction<string[]>) => {
      state.nodes = state.nodes.filter(
        (node) => !action.payload.includes(node.id)
      );
      state.selectedNode = null;
      state.sidePanel = "action";
      // state.edges = state.edges.filter(
      //   (edge) =>
      //     !action.payload.includes(edge.source) &&
      //     !action.payload.includes(edge.target)
      // );
    },

    selectNode: (state, action: PayloadAction<string | null>) => {
      // console.log(action.payload);
      if (action.payload === null) {
        if (state.nodes.length > 0) {
          state.sidePanel = "action";
          state.selectedNode = null;
        } else {
          state.sidePanel = "trigger";
        }
      }

      const isNode = state.nodes.find((node) => node.id === action.payload);
      if (isNode) {
        state.selectedNode = isNode;
        if (isNode.data.authAccountInfo._id) {
          state.sidePanel = "configuration";
        } else {
          state.sidePanel = "account";
        }
      }
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
      state.backwardList = createAdjacencyList(
        state.nodes,
        state.edges,
        "backward"
      );
      state.forwardList = createAdjacencyList(
        state.nodes,
        state.edges,
        "forward"
      );
    },

    setNodeAccount: (
      state,
      action: PayloadAction<{
        nodeId: string;
        account: Account;
        userId: string;
      }>
    ) => {
      const node = state.nodes.find(
        (node) => node.id === action.payload.nodeId
      );
      if (node) {
        node.data.authAccountInfo = {
          ...node.data.authAccountInfo,
          ...action.payload.account,
          userId: action.payload.userId,
        };
        state.sidePanel = "configuration";
        state.selectedNode = node;
      }
    },

    updateNodeConfig: (
      state,
      action: PayloadAction<{ nodeId: string; config: Record<string, any> }>
    ) => {
      const node = state.nodes.find(
        (node) => node.id === action.payload.nodeId
      );
      if (node) {
        node.data.config = action.payload.config;
      }
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
  setNodeAccount,
  updateNodeConfig,
} = workflowSlice.actions;

export default workflowSlice.reducer;
