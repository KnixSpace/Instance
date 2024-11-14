import { Node } from "@xyflow/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

type Account = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
};

type AccountListProps = {
  debouncedQuery: string;
  isAccountListUpdated: boolean;
  scope: string[] | undefined;
  selectedNode: Node;
};

const AccountList = ({
  debouncedQuery,
  isAccountListUpdated,
  scope,
  selectedNode,
}: AccountListProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const service = selectedNode.data.service as string;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/fetchServiceAccount`,
        {
          service: service.toLowerCase(),
          scopes: scope ? scope : null,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      setAccounts(response.data.accounts);
    } catch (error: any) {
      console.error("Error fetching accounts:", error);
      if (error.response) {
        if (error.response.status === 500) {
          setError("Server error. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [scope, selectedNode.data.service]);

  useEffect(() => {
    fetchAccounts();
  }, [isAccountListUpdated, fetchAccounts]);

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          account?.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          account?.email.toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [debouncedQuery, accounts]
  );

  return (
    <div className="flex flex-col h-full gap-4 flex-1 overflow-y-auto">
      {loading ? (
        <div className="h-full flex justify-center items-center text-sm text-gray-400">
          Loading...
        </div>
      ) : error ? (
        <div className="h-full flex justify-center items-center">
          <h1 className="text-red-500 text-sm text-center">{error}</h1>
        </div>
      ) : filteredAccounts.length ? (
        filteredAccounts.map((account) => (
          <div
            className="flex gap-4 items-center border border-darkSecondary rounded-md p-4 bg-background cursor-pointer hover:border-secondary transition-all duration-300 ease-in-out"
            key={account._id}
          >
            <img src={account.avatar} alt={account.name} className="size-8" />
            <div className="flex-1">
              <h2 className="font-medium text-sm">{account.name}</h2>
              <p className="text-xs text-gray-400 text-wrap">{account.email}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="h-full flex justify-center items-center">
          <h1 className="text-gray-400 text-sm text-center">
            No accounts found <br /> Please add one
          </h1>
        </div>
      )}
    </div>
  );
};
export default AccountList;
