import { workflowNodesConfig } from "@/components/dashboard/workspace/constant";
import {
  Account,
  Node,
  SidePanelMode,
  workflowState,
} from "@/types/workflowTypes";
import { createAdjacencyList} from "@/utils/workflowUtils";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Edge } from "@xyflow/react";

const initialState: workflowState = {
  name: null,
  description: null,
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
    initializedNewWorkflow: (
      state,
      action: PayloadAction<{ name: string; description: string }>
    ) => {
      state.name = action.payload.name;
      state.description = action.payload.description;
    },

    initializedExistingWorkflow: (state, action: PayloadAction<any>) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      state.selectedNode = null;
      if (state.nodes.length > 0) {
        state.sidePanel = "action";
      } else {
        state.sidePanel = "trigger";
      }
      state.name = action.payload.name;
      state.description = action.payload.description;
    },

    updateNodePositions: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload.map((node) => {
        return {
          ...node,
          position: {
            x: node.position.x,
            y: node.position.y,
          },
        };
      });
    },

    setMetaData: (
      state,
      action: PayloadAction<{ name: string; description: string }>
    ) => {
      state.name = action.payload.name;
      state.description = action.payload.description;
    },

    addNewNode: (state, action: PayloadAction<Node>) => {
      state.nodes = state.nodes.map((node) => {
        return {
          ...node,
          selected: false,
        };
      });
      state.nodes.push(action.payload);
      state.sidePanel = "configuration";
    },

    setDeletedNodes: (state, action: PayloadAction<string[]>) => {
      state.nodes = state.nodes.filter(
        (node) => !action.payload.includes(node.id)
      );
      state.selectedNode = null;
      if (state.nodes.length > 0) {
        state.sidePanel = "action";
      } else {
        state.sidePanel = "trigger";
      }
    },

    selectNode: (state, action: PayloadAction<string | null>) => {
      // console.log(action.payload);
      if (action.payload === null) {
        if (state.nodes.length > 0) {
          state.sidePanel = "action";
          state.selectedNode = null;
          state.nodes = state.nodes.map((node) => {
            return {
              ...node,
              selected: false,
            };
          });
        } else {
          state.sidePanel = "trigger";
        }
      }

      const isNode = state.nodes.find((node) => node.id === action.payload);
      if (isNode) {
        state.selectedNode = isNode;
        state.nodes = state.nodes.map((node) => {
          return {
            ...node,
            selected: node.id === action.payload,
          };
        });
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
        state.sidePanel = "action";
      }
    },

    resetNodeConfig: (state, action: PayloadAction<Node>) => {
      const defaultConfig = workflowNodesConfig.find(
        (config) => config.data.action === action.payload.data.action
      )?.data.config;
      const node = state.nodes.find((node) => node.id === action.payload.id);
      if (node) {
        node.data.config = defaultConfig;
      }
    },
  },
});

export const {
  initializedNewWorkflow,
  initializedExistingWorkflow,
  updateNodePositions,
  setMetaData,
  addNewNode,
  addNewEdge,
  selectNode,
  setDeletedNodes,
  setSidePanelMode,
  setWarning,
  setAdjacencyList,
  setNodeAccount,
  updateNodeConfig,
  resetNodeConfig,
} = workflowSlice.actions;

export default workflowSlice.reducer;
