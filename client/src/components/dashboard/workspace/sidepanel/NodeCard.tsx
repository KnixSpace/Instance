type Props = {
  node: any;
};
const NodeCard = ({ node }: Props) => {
  const onDragStart = (e: any, node: any) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(node));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="flex gap-4 items-center border border-darkSecondary rounded-md mb-4 p-4 bg-background cursor-grab hover:border-secondary transition-all duration-300 ease-in-out"
      draggable
      onDragStart={(e) => {
        onDragStart(e, node);
      }}
    >
      <img src={node?.data?.icon} alt="" className="size-8" />
      <div className="flex-1">
        <h2 className="font-medium text-sm">{node?.data?.label}</h2>
        <p className="text-xs text-gray-400 text-wrap">
          {node?.data?.description}
        </p>
      </div>
    </div>
  );
};
export default NodeCard;
