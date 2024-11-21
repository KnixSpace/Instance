"use client";

import { useState, useEffect } from "react";
import NodeList from "./NodeList";
import { useAppSelector } from "@/redux/hooks";
import SearchNodes from "./SearchNodes";
import Configuration from "./configuration/Configuration";
import Account from "./account/Account";

type Props = {};

const SidePanel = (props: Props) => {
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
      {mode === "action" || mode === "trigger" ? (
        <>
          <div className="mb-4">
            <div className="mb-1 text-lg">
              {mode === "action" ? "Actions" : "Trigger"}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {mode === "action" ? "Add an action" : "Add a trigger"}
            </div>
            <SearchNodes
              nodeType={mode === "action" ? "action" : "trigger"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <NodeList debouncedQuery={debouncedQuery} mode={mode} />
        </>
      ) : (
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
          {mode === "configuration" && selectedNode && (
            <Configuration selectedNode={selectedNode} />
          )}
          {mode === "account" && selectedNode && (
            <Account selectedNode={selectedNode} />
          )}
        </>
      )}
    </div>
  );
};

export default SidePanel;
