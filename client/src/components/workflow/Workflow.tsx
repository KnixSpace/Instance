"use client";

import {
  addEdge,
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TriggerNode from "./nodes/TriggerNode";
import ActionNode from "./nodes/ActionNode";

import { useCallback } from "react";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addNewEdge,
  addNewNode,
  initializedNewWorkflow,
  selectNode,
  setDeletedNodes,
  setSidePanelMode,
} from "@/lib/features/workflow/workflowSlice";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

type Props = {};
const Workflow = (props: Props) => {
  const flow = useAppSelector((state) => state.workflow);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(flow.edges);

  const { screenToFlowPosition } = useReactFlow();
  const dispatch = useAppDispatch();

  const onConnect = useCallback(
    (params: any) => {
      setEdges((edges) => {
        const newEdges = addEdge(params, edges);
        dispatch(addNewEdge(newEdges));
        return newEdges;
      });
    },
    [setEdges, dispatch]
  );

  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: any) => {
    event.preventDefault();
    const node = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );
    const type = node.type;
    if (typeof type === "undefined" || type === null) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    setNodes((nodes) => nodes.map((node) => ({ ...node, selected: false })));

    const newNode: Node = {
      id: v4(),
      type: type,
      position: position,
      data: node.data,
      selected: true,
    };

    setNodes((nodes) => nodes.concat(newNode));
    dispatch(addNewNode(newNode));
    dispatch(selectNode(newNode.id));
    dispatch(setSidePanelMode("configuration"));
  };

  const onNodeClick = (event: any, node: Node) => {
    dispatch(selectNode(node.id));
    dispatch(setSidePanelMode("configuration"));
  };

  const onPaneClick = () => {
    dispatch(selectNode(null));
    dispatch(setSidePanelMode("action"));
  };

  const onEdgesDelete = (deletedEdges: Edge[]) => {
    dispatch(addNewEdge(edges.filter((edge) => !deletedEdges.includes(edge))));
  };

  const onNodesDelete = (deletedNodes: Node[]) => {
    if (deletedNodes.find((node) => node.type === "trigger")) {
      setNodes([]);
      setEdges([]);
      dispatch(initializedNewWorkflow());
      return;
    }
    const nodesToSave = nodes.filter((node) => !deletedNodes.includes(node));
    dispatch(setDeletedNodes(nodesToSave));
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        className="text-background"
        panOnScroll
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
      >
        <Background />
        <Controls className="text-background" />
      </ReactFlow>
    </div>
  );
};
export default Workflow;
