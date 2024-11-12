"use client";

import { useState, useEffect } from "react";
import NodeList from "./NodeList";
import { useAppSelector } from "@/lib/hooks";
import SearchNodes from "./SearchNodes";
import Configuration from "./configuration/Configuration";

type Props = {};

const SidePanel = (props: Props) => {
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const mode = useAppSelector((state) => state.workflow.sidePanel);
  const selectedNode = useAppSelector((state) => state.workflow.selectedNode);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col p-4">
      {mode === "configuration" ? (
        <>
          <div>
            <div className="flex gap-4 items-center mb-8">
              <img
                src={selectedNode?.data.icon as string}
                alt=""
                className="size-12"
              />
              <div>
                <div className="">{selectedNode?.data.service as string}</div>
                <div className="text-sm text-secondary">
                  {selectedNode?.data.description as string}
                </div>
              </div>
            </div>
          </div>
          {selectedNode && <Configuration selectedNode={selectedNode} />}
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