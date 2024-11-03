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
  selectNode,
  setSidePanelMode,
} from "@/lib/features/workflow/workflowSlice";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

type Props = {};
const Workflow = (props: Props) => {
  const workflow = useAppSelector((state) => state.workflow);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(workflow.edges);

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
      >
        <Background />
        <Controls className="text-background" />
      </ReactFlow>
    </div>
  );
};
export default Workflow;
