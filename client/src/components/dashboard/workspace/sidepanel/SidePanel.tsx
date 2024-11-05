"use client";

import { useState, useEffect } from "react";
import NodeList from "./NodeList";
import { setSidePanelMode } from "@/lib/features/workflow/workflowSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import SearchNodes from "./SearchNodes";

type Props = {};

const SidePanel = (props: Props) => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const mode = useAppSelector((state) => state.workflow.sidePanel);
  const selectedNode = useAppSelector((state) => state.workflow.selectedNode);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(""); 
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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
            <div className="text-sm text-gray-500 mb-2">
              {nodes.length > 0 ? "Add an action" : "Add a trigger"}
            </div>
            <SearchNodes
              nodeType={nodes.length > 0 ? "action" : "trigger"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <NodeList debouncedQuery={debouncedQuery} nodes={nodes} />
        </>
      )}
    </div>
  );
};

export default SidePanel;
