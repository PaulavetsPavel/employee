import React from 'react';

const SearchEmployeeElement = ({ searchTerm, searchField, setSearchTerm, setSearchField }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <span className="fw-semibold text-primary d-flex align-items-center">
        <i className="bi bi-search me-1"></i> Поиск
      </span>

      <input
        type="text"
        className="form-control"
        placeholder={`Поиск по ${searchField === 'name' ? 'имени' : 'должности'}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ minWidth: '300px', flexGrow: 1 }}
      />

      <select
        className="form-select"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}>
        <option value="name">Имя</option>
        <option value="position">Должность</option>
      </select>
    </div>
  );
};

export default SearchEmployeeElement;
