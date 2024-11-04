"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import NodeCard from "./NodeCard";
import { setSidePanelMode } from "@/lib/features/workflow/workflowSlice";
import { nodesConfigurationArray } from "./constant";
import { useState, useEffect } from "react";

type Props = {};
const SidePanel = (props: Props) => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const mode = useAppSelector((state) => state.workflow.sidePanel);
  const selectedNode = useAppSelector((state) => state.workflow.selectedNode);

  const [searchQuery, setSearchQuery] = useState<string>(""); // The search input value
  const [debouncedQuery, setDebouncedQuery] = useState<string>(""); // The debounced search term

  // Update debounced query after delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Handle input change and set search query
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter nodes based on debounced query
  const filteredNodes = nodesConfigurationArray.filter((node) => {
    const nodeType = nodes.length > 0 ? "action" : "trigger";
    return (
      (node.type === nodeType &&
        node.data.label.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
      (node.type === nodeType &&
        node.data.description
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase()))
    );
  });

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
            <div>
              <input
                type="text"
                placeholder={`Search for a ${
                  nodes.length > 0 ? "action" : "trigger"
                }`}
                onChange={handleOnChange}
                className="w-full bg-background border border-darkSecondary focus:border-secondary focus:outline-none rounded-full text-sm py-2 px-4"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filteredNodes.map((node, i) => (
              <NodeCard key={i} node={node} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default SidePanel;
