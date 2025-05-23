"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import SearchAccounts from "./SearchAccounts";
import AccountList from "./AccountList";
import { Node } from "@/types/workflowTypes";

const Account = ({ selectedNode }: { selectedNode: Node }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const { url, scope } = selectedNode.data.authAccountInfo;

  const handleAddNew = useCallback(async () => {
    try {
      const response = await axios.post(
        url as string,
        {
          scopes: scope || null,
        },
        { withCredentials: true }
      );

      window.open(
        response.data.authUrl,
        "_blank",
        `width=600,height=600,popup=true,noopener=true,noreferrer=true,top=${
          window.screen.availHeight / 2 - 300
        },left=${window.screen.availWidth / 2 - 300}`
      );
    } catch (error) {
      console.error("Failed to initiate Add New:", error);
    }
  }, [url, scope]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1>Accounts</h1>
          <div
            className="flex cursor-pointer"
            onClick={handleRefresh}
            aria-label="Refresh accounts"
          >
            <span
              className={`material-symbols-rounded text-gray-400 ${
                refreshing ? "animate-spin" : ""
              }`}
              style={{ fontSize: "20px" }}
            >
              refresh
            </span>
          </div>
        </div>
        <div
          className="p-1 px-4 rounded bg-cta text-sm cursor-pointer"
          onClick={handleAddNew}
        >
          Add New
        </div>
      </div>
      <SearchAccounts
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <AccountList
        selectedNode={selectedNode}
        isAccountListUpdated={refreshing}
        debouncedQuery={debouncedQuery}
        scope={scope}
      />
    </div>
  );
};
export default Account;
