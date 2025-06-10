import React from 'react';

const EmployeeTableHeader = () => {
  return (
    <thead className="table-light">
      <tr>
        <th className="text-center">
          <i className="bi bi-person me-2"></i>Имя
        </th>
        <th className="text-center">
          <i className="bi bi-cake me-2"></i>Дата рождения
        </th>
        <th className="text-center">
          <i className="bi bi-briefcase me-2"></i>Должность
        </th>
        <th className="text-center">
          <i className="bi bi-calendar-event me-2"></i>Дата приёма
        </th>
        <th className="text-center">
          <i className="bi bi-calendar-x me-2"></i>Окончание контракта
        </th>
        <th className="text-center">
          <i className="bi bi-info-circle me-2"></i>Статус
        </th>
        <th className="text-center">
          <i className="bi bi-currency-exchange me-2"></i>Зарплата (Br)
        </th>
        <th className="text-center">
          <i className="bi bi-image me-2"></i>Фото
        </th>
        <th className="text-center">
          <i className="bi bi-gear me-2"></i>Действия
        </th>
      </tr>
    </thead>
  );
};

export default EmployeeTableHeader;
