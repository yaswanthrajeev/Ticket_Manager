import React, { useState } from 'react';

function SearchBar({ onSearch, placeholder = "Search tickets...", activeFilters = {} }) {
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

  const hasActiveFilters = Object.values(activeFilters).some(filter => filter !== 'all');

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
      {hasActiveFilters && (
        <div className="active-filters">
          <small>Active filters: {Object.entries(activeFilters)
            .filter(([key, value]) => value !== 'all')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}
          </small>
        </div>
      )}
    </div>
  );
}

export default SearchBar; 