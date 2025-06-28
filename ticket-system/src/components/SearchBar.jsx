import React, { useState } from 'react';

function SearchBar({ onSearch, placeholder = "Search tickets..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch(''); // Clear search results
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="search-input"
          />
          <div className="search-buttons">
            <button type="submit" className="btn btn-primary btn-sm">
              🔍 Search
            </button>
            {searchTerm && (
              <button 
                type="button" 
                onClick={handleClear}
                className="btn btn-secondary btn-sm"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar; 