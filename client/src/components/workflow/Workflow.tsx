"use client";

import {
  addEdge,
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowInstance,
  SelectionMode,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TriggerNode from "./nodes/TriggerNode";
import ActionNode from "./nodes/ActionNode";

import { useCallback, useState } from "react";
import { v4 } from "uuid";
import { useAppDispatch } from "@/lib/hooks";
import {
  addNewNode,
  selectNode,
  setSidePanelMode,
} from "@/lib/features/workflow/workflowSlice";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

type Props = {};
const Workflow = (props: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();
  const dispatch = useAppDispatch();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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

    if (!reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node = {
      id: v4(),
      type: type,
      position: position,
      data: node.data,
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
        onInit={setReactFlowInstance as any}
      >
        <Background />
        <Controls className="text-background" />
      </ReactFlow>
    </div>
  );
};
export default Workflow;
