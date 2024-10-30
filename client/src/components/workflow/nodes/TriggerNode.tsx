import { appIcons } from "@/lib/constants";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

type Props = {
  data: any;
};
const TriggerNode = ({ data }: Props) => {
  return (
    <>
      <div className="bg-background border border-secondary p-2 flex gap-2 items-center rounded-sm text-gray-200 max-w-64">
        <img src={appIcons.drive} alt="" className="size-6" />
        <div className="flex-1">
          <h2 className="font-medium">Drive</h2>
          <p className="text-sm text-gray-400 text-wrap">Create docs file</p>
        </div>
        <div className="absolute top-2 right-2 size-1 rounded-full bg-green-500" />
      </div>
      <Handle type="source" position={Position.Bottom} id="trigger-output" />
    </>
  );
};
export default TriggerNode;
