import React, { useState } from 'react';

function SearchableDropdown({ items, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="position-relative w-100">
      {/* Search Input */}
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchTerm}
        onFocus={() => setIsDropdownOpen(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="dropdown-menu show w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="dropdown-item"
                onClick={() => {
                  onSelect(item);
                  setSearchTerm(item.name);
                  setIsDropdownOpen(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="dropdown-item text-muted">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
