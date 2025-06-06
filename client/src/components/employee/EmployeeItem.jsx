import { useContext } from 'react';
import { Context } from '../../main';
import { Badge } from 'react-bootstrap';
import AdminButtonGroup from '../admin/AdminButtonGroup';

const EmployeeItem = ({ employee, deleteEmployee }) => {
  const { store } = useContext(Context);

  const currentUser = store.getUser();

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
        {new Date(employee.hire_date).toLocaleDateString('ru-RU')}
      </td>
      <td className="align-middle text-center">
        <img
          src={employee.photo_url ? employee.photo_url : '/notPhoto.png'}
          alt={employee.name}
          className="rounded-circle"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'container',
            border: '2px solid #dee2e6',
          }}
        />
      </td>
      <td className="align-middle text-center">
        {currentUser?.role === 'admin' ? (
          <AdminButtonGroup deleteEmployee={deleteEmployee} id={employee.id} />
        ) : (
          <p>Только для администраторов</p>
        )}
      </td>
    </>
  );
};

export default EmployeeItem;
