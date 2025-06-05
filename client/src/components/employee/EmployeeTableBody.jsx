import React from 'react';
import EmployeeItem from './EmployeeItem';

const EmployeeTableBody = ({ employees, deleteEmployee }) => {


  return (
    <>
      <tbody>
        {employees.length ? (
          employees.map((employee) => (
            <tr key={employee.id}>
              <EmployeeItem employee={employee} deleteEmployee={deleteEmployee} />
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-5 text-muted">
              <i className="bi bi-emoji-frown fs-1"></i>
              <p className="mt-2">Нет данных о сотрудниках</p>
            </td>
          </tr>
        )}
      </tbody>
    </>
  );
};

export default EmployeeTableBody;
