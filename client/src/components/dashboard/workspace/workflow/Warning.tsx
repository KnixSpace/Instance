type Props = {
  message: string | null;
};
const Warning = ({ message }: Props) => {
  return (
    <div className="absolute top-4 left-0 w-full flex justify-center items-center text-xs">
      <div className="flex items-center text-red-500 py-2 px-4 rounded-full bg-red-950/50">
        <span
          className="material-symbols-rounded"
          style={{ fontSize: "16px", fontWeight: 300 }}
        >
          warning
        </span>
        <span className="ml-1">{message}</span>
      </div>
    </div>
  );
};
export default Warning;
