type SearchBarProps = {
  nodeType: "action" | "trigger";
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const SearchNodes = ({
  nodeType,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder={`Search for a ${nodeType}`}
        value={searchQuery}
        onChange={handleOnChange}
        className="w-full bg-background border border-darkSecondary focus:border-secondary focus:outline-none rounded-full text-sm py-2 px-4"
      />
    </div>
  );
};

export default SearchNodes;
