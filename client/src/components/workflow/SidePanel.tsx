"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import NodeCard from "./NodeCard";
import { setSidePanelMode } from "@/lib/features/workflow/workflowSlice";
import { nodesConfigurationArray } from "./constant";

type Props = {};
const SidePanel = (props: Props) => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const mode = useAppSelector((state) => state.workflow.sidePanel);
  const selectedNode = useAppSelector((state) => state.workflow.selectedNode);

  return (
    <div className="h-full flex flex-col p-4">
      {mode === "configuration" ? (
        <>
          {JSON.stringify(selectedNode)}
          <div
            onClick={() => {
              dispatch(setSidePanelMode("action"));
            }}
          >
            ok
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <div className="mb-1 text-lg">
              {nodes.length > 0 ? "Actions" : "Trigger"}
            </div>
            <div className="text-sm text-gray-500">
              {nodes.length > 0 ? "Add an action" : "Add a trigger"}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {nodes.length > 0
              ? nodesConfigurationArray
                  .filter((node) => node.type !== "trigger")
                  .map((node, i) => <NodeCard key={i} node={node} />)
              : nodesConfigurationArray
                  .filter((node) => node.type === "trigger")
                  .map((node, i) => <NodeCard key={i} node={node} />)}
          </div>
        </>
      )}
    </div>
  );
};
export default SidePanel;
