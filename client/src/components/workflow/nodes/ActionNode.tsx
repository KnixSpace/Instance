import { Handle, NodeProps, Position } from "@xyflow/react";

const ActionNode = ({ data, selected }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="trigger-output" />
      <div
        className={`bg-background border p-4 flex gap-4 items-center rounded-md text-gray-200 max-w-64 transition-all duration-300 ease-in-out ${
          selected ? "border-cta" : "border-secondary"
        }`}
      >
        <img src={data.icon as string} alt="" className="size-6" />
        <div className="flex-1">
          <h2 className="font-medium text-sm mb-1">{data.label as string}</h2>
          <p className="text-xs text-gray-400 text-wrap">
            {data.description as string}
          </p>
        </div>
        <div className="absolute top-2 left-2 size-1 rounded-full bg-green-500" />
      </div>
      <Handle type="source" position={Position.Bottom} id="trigger-output" />
    </>
  );
};
export default ActionNode;
