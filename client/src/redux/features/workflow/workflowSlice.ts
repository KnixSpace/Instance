import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Edge } from "@xyflow/react";
import { workflowNodesConfig } from "@/components/dashboard/workspace/constant";
import {
  Account,
  Node,
  SidePanelMode,
  WorkflowState,
} from "@/types/workflowTypes";
import { createAdjacencyList } from "@/utils/workflowUtils";

const initialState: WorkflowState = {
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
    createNewWorkflow: (
      state,
      action: PayloadAction<{ name: string; description: string }>
    ) => {
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.sidePanel = "trigger";
    },

    loadExistingWorkflow: (state, action: PayloadAction<WorkflowState>) => {
      const { nodes, edges, name, description } = action.payload;

      state.nodes = nodes;
      state.edges = edges;
      state.name = name;
      state.description = description;
      state.selectedNode = null;

      // More robust panel state determination
      state.sidePanel = nodes.length > 0 ? "action" : "trigger";
    },

    updateNodeLayout: (state, action: PayloadAction<Node[]>) => {
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

    updateWorkflowMetadata: (
      state,
      action: PayloadAction<{ name: string; description: string }>
    ) => {
      state.name = action.payload.name;
      state.description = action.payload.description;
    },

    insertNode: (state, action: PayloadAction<Node>) => {
      state.nodes = state.nodes.map((node) => {
        return {
          ...node,
          selected: false,
        };
      });
      state.nodes.push(action.payload);
      state.sidePanel = "configuration";
    },

    removeNodes: (state, action: PayloadAction<string[]>) => {
      state.nodes = state.nodes.filter(
        (node) => !action.payload.includes(node.id)
      );

      state.selectedNode = null;
      state.sidePanel = state.nodes.length > 0 ? "action" : "trigger";
    },

    focusNode: (state, action: PayloadAction<string | null>) => {
      // console.log(action.payload);
      if (action.payload === null) {
        state.selectedNode = null;
        state.nodes = state.nodes.map((node) => ({
          ...node,
          selected: false,
        }));
        state.sidePanel = state.nodes.length > 0 ? "action" : "trigger";
        return;
      }

      const selectedNode = state.nodes.find(
        (node) => node.id === action.payload
      );

      if (selectedNode) {
        state.selectedNode = selectedNode;
        state.nodes = state.nodes.map((node) => ({
          ...node,
          selected: node.id === action.payload,
        }));

        // Determine side panel based on node's account status
        state.sidePanel = selectedNode.data.authAccountInfo._id
          ? "configuration"
          : "account";
      }
    },

    insertEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },

    changeSidePanelMode: (state, action: PayloadAction<SidePanelMode>) => {
      state.sidePanel = action.payload;
    },

    setWorkflowWarning: (
      state,
      action: PayloadAction<{ isWarning: boolean; message: string | null }>
    ) => {
      state.warning = action.payload;
    },

    rebuildAdjacencyLists: (state) => {
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

    configureNodeAccount: (
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

    updateNodeConfiguration: (
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

    resetNodeToDefaultConfig: (state, action: PayloadAction<Node>) => {
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
  createNewWorkflow,
  loadExistingWorkflow,
  updateNodeLayout,
  updateWorkflowMetadata,
  insertNode,
  removeNodes,
  focusNode,
  insertEdges,
  changeSidePanelMode,
  setWorkflowWarning,
  rebuildAdjacencyLists,
  configureNodeAccount,
  updateNodeConfiguration,
  resetNodeToDefaultConfig,
} = workflowSlice.actions;

export default workflowSlice.reducer;
