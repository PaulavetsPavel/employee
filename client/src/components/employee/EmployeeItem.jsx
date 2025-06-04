import { Badge } from 'react-bootstrap';
import AdminButtonGroup from '../admin/AdminButtonGroup';

const EmployeeItem = ({ employee, deleteEmployee }) => {
  return (
    <>
      <td className="align-middle ">
        <strong>{employee.name}</strong>
      </td>
      <td className="align-middle text-center">
        <Badge bg="info" className="me-1">
          {employee.position}
        </Badge>
      </td>
      <td className="align-middle text-center">
        {new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'BYN',
          minimumFractionDigits: 0,
        }).format(employee.salary)}
      </td>
      <td className="align-middle text-center">
        {new Date(employee.hireDate).toLocaleDateString('ru-RU')}
      </td>
      <td className="align-middle text-center">
        {employee.photo ? (
          <img
            src={employee.photo}
            alt={employee.name}
            className="rounded-circle"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              border: '2px solid #dee2e6',
            }}
          />
        ) : (
          <i className="bi bi-person-circle fs-4 text-secondary"></i>
        )}
      </td>
      <td className="align-middle text-center">
        <AdminButtonGroup deleteEmployee={deleteEmployee} id={employee.id} />
      </td>
    </>
  );
};

export default EmployeeItem;
