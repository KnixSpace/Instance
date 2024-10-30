"use client";

import { Background, Controls, ReactFlow, SelectionMode } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TriggerNode from "./nodes/TriggerNode";

const nodeTypes = {
  trigger: TriggerNode,
};

const node = [
  {
    id: "node-1",
    type: "trigger",
    data: { label: "Trigger Node" },
    position: { x: 250, y: 50 },
  },
];

type Props = {};
const Workflow = (props: Props) => {
  return (
    <div className="w-full h-full">
      <ReactFlow
        className="text-background"
        panOnScroll
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        nodeTypes={nodeTypes}
        nodes={node}
      >
        <Background />
        <Controls className="text-background" />
      </ReactFlow>
    </div>
  );
};
export default Workflow;
