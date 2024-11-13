"use client";
import { Node } from "@xyflow/react";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  selectedNode: Node;
};
const Account = ({ selectedNode }: { selectedNode: Node }) => {
  const [accounts, setAccounts] = useState<
    { _id: string; name: string; avatar: string; email: string }[]
  >([]);
  const [refresh, setRefresh] = useState(false);

  const { url, scope } = selectedNode.data.account as {
    url: string;
    scope?: string[];
  };

  const fetchAccounts = async () => {
    const service = selectedNode.data.service as string;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/fetchServiceAccount`,
        {
          service: service.toLowerCase(),
          scopes: scope ? scope : null,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setAccounts(response.data.accounts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNew = async () => {
    const response = await axios.post(
      url,
      {
        scopes: scope ? scope : null,
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
  };

  useEffect(() => {
    fetchAccounts();
  }, [refresh]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1>Accounts</h1>
          <div
            className="flex"
            onClick={() => {
              setRefresh(true);
              setTimeout(() => {
                setRefresh(false);
              }, 1000);
            }}
          >
            <span
              className={`material-symbols-rounded text-gray-400 ${
                refresh ? "animate-spin" : ""
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
      <div className="flex flex-col h-full gap-4 flex-1 overflow-y-auto">
        {accounts.map((account) => (
          <div
            className="flex gap-4 items-center border border-darkSecondary rounded-md p-4 bg-background cursor-pointer hover:border-secondary transition-all duration-300 ease-in-out"
            key={account._id}
          >
            <img src={account.avatar} alt="" className="size-8" />
            <div className="flex-1">
              <h2 className="font-medium text-sm">{account.name}</h2>
              <p className="text-xs text-gray-400 text-wrap">{account.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Account;
