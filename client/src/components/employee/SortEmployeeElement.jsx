import React from 'react';

const SortEmployeeElement = ({ sortField, sortOrder, setSortField, setSortOrder }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <span className="fw-semibold text-primary d-flex align-items-center">
        <i className="bi bi-funnel me-1"></i> Сортировка
      </span>

      <select
        className="form-select"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}>
        <option value="name">Имя</option>
        <option value="salary">Зарплата</option>
        <option value="hire_date">Дата приёма</option>
      </select>

      <select
        className="form-select"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">↑ По возрастанию</option>
        <option value="desc">↓ По убыванию</option>
      </select>
    </div>
  );
};

export default SortEmployeeElement;
