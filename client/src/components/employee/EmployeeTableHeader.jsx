import React from 'react';

const EmployeeTableHeader = () => {
  return (
    <thead className="table-light">
      <tr>
        <th className=" text-center">
          <i className="bi bi-person me-2 text-center"></i>Имя
        </th>
        <th className=" text-center">
          <i className="bi bi-briefcase me-2"></i>Должность
        </th>
        <th className=" text-center">
          <i className="bi bi-currency-dollar me-2"></i>Зарплата
        </th>
        <th className=" text-center">
          <i className="bi bi-calendar me-2"></i>Дата приема
        </th>
        <th className=" text-center">
          <i className="bi bi-image me-2"></i>Фото
        </th>
        <th className=" text-center">
          <i className="bi bi-gear me-2"></i>Действия
        </th>
      </tr>
    </thead>
  );
};

export default EmployeeTableHeader;
