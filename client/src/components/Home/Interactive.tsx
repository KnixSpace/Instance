"use client";
import { useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomImageNode from "./CustomImageNode";

const initialNodes = [
  {
    id: "A",
    position: { x: 50, y: 100 },
    type: "imageNode",
    data: {
      label: "Node A",
      imageUrl: "/api/placeholder/32/32",
    },
  },
  {
    id: "B",
    position: { x: 200, y: 50 },
    type: "imageNode",
    data: {
      label: "Node B",
      imageUrl: "/api/placeholder/32/32",
    },
  },
  {
    id: "C",
    position: { x: 200, y: 150 },
    type: "imageNode",
    data: {
      label: "Node C",
      imageUrl: "/api/placeholder/32/32",
    },
  },
  {
    id: "D",
    position: { x: 350, y: 100 },
    type: "imageNode",
    data: {
      label: "Node D",
      imageUrl: "/api/placeholder/32/32",
    },
  },
  {
    id: "E",
    position: { x: 350, y: 150 },
    type: "imageNode",
    data: {
      label: "Node E",
      imageUrl: "/api/placeholder/32/32",
    },
  },
  {
    id: "F",
    position: { x: 500, y: 100 },
    type: "imageNode",
    data: {
      label: "Node F",
      imageUrl: "/api/placeholder/32/32",
    },
  },
];

const initialEdges = [
  { id: "a-b", source: "A", target: "B", type: "smoothstep" },
  { id: "a-c", source: "A", target: "C", type: "smoothstep" },
  { id: "b-d", source: "B", target: "D", type: "smoothstep" },
  { id: "c-e", source: "C", target: "E", type: "smoothstep" },
  { id: "d-f", source: "D", target: "F", type: "smoothstep" },
  { id: "e-f", source: "E", target: "F", type: "smoothstep" },
];

const nodeTypes = {
  imageNode: CustomImageNode,
};

type Props = {};
const Interactive = (props: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  return (
    <div className="px-8 w-full h-[400px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        {/* <Controls /> */}
      </ReactFlow>
    </div>
  );
};
export default Interactive;
