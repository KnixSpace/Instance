import { Account } from "@/types/workflowTypes";
import { memo } from "react";

type Props = {
  account: Account;
  onChangeAccount: () => void;
};
const AccountInfo = ({ account, onChangeAccount }: Props) => {
  return (
    <div className="mb-2">
      <div
        className="text-sm mb-2 text-gray-400 cursor-pointer"
        onClick={onChangeAccount}
      >
        Change Account
      </div>
      <div className="flex items-center gap-4">
        <div className="size-8 rounded bg-lightbackground overflow-hidden">
          <img
            src={account.avatar}
            alt={account.name}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-medium text-sm">{account.name}</h2>
          {account.email && (
            <h6 className="text-xs text-gray-400 text-wrap">{account.email}</h6>
          )}
        </div>
      </div>
    </div>
  );
};
export default memo(AccountInfo);
