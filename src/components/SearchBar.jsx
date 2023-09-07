const SearchBar = ({ onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    < div className="divSearchBar" >
      <form role="search" id="form" className="searchBar">
        <input
          className="searchInput"
          type="search"
          id="query"
          name="q"
          placeholder="BUSCAR EVENTOS..."
          aria-label="Search through site content"
          onChange={handleInputChange}
        />
      </form>
    </div >
  );
};

export default SearchBar;