type SearchAccountsProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};
const SearchAccounts = ({
  searchQuery,
  setSearchQuery,
}: SearchAccountsProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search for an account"
        value={searchQuery}
        onChange={handleOnChange}
        className="w-full bg-background border border-darkSecondary focus:border-secondary focus:outline-none rounded-full text-sm py-2 px-4"
      />
    </div>
  );
};
export default SearchAccounts;
