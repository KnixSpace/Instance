import { Handle, Position } from "@xyflow/react";

type Props = {
  data: any;
};
const ActionNode = ({ data }: Props) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="trigger-output" />
      <div className="bg-background border border-secondary p-2 flex gap-2 items-center rounded-sm text-gray-200 w-64">
        <img src={data.icon} alt="" className="size-6" />
        <div className="flex-1">
          <h2 className="font-medium">{data.label}</h2>
          <p className="text-sm text-gray-400 text-wrap">{data.description}</p>
        </div>
        <div className="absolute top-2 right-2 size-1 rounded-full bg-green-500" />
      </div>
      <Handle type="source" position={Position.Bottom} id="trigger-output" />
    </>
  );
};
export default ActionNode;
