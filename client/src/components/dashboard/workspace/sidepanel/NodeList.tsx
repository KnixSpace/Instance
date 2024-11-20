import { workflowNodesConfig } from "../constant";
import NodeCard from "./NodeCard";

type NodeListProps = {
  debouncedQuery: string;
  mode: "trigger" | "action"; // Adjust type according to your node structure
};

const NodeList = ({ debouncedQuery, mode }: NodeListProps) => {
  // Filter nodes based on debounced query
  const filteredNodes = workflowNodesConfig.filter((node) => {
    const nodeType = mode === "action" ? "action" : "trigger";
    return (
      (node.type === nodeType &&
        node.data.label.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
      (node.type === nodeType &&
        node.data.description
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase()))
    );
  });

  return (
    <div className="flex-1 overflow-auto">
      {filteredNodes.map((node, i) => (
        <NodeCard key={i} node={node} />
      ))}
    </div>
  );
};

export default NodeList;
