import { memo } from "react";
import { Handle, Position } from "reactflow";

const CustomImageNode = (data: any) => {
  return (
    <div className="relative" style={{ width: "32px", height: "32px" }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: "16px", background: "#555" }}
      />
      <div className="w-8 h-8 bg-white border border-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
        <img
          src={"/logo.jpg"}
          alt={data.label}
          className="w-full h-full object-cover"
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: "16px", background: "#555" }}
      />
    </div>
  );
};

export default memo(CustomImageNode);
