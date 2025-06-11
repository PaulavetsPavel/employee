import { useContext } from 'react';
import { Context } from '../../main';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Badge } from 'react-bootstrap';
import AdminButtonGroup from '../admin/AdminButtonGroup';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EmployeeItem = ({ employee, deleteEmployee }) => {
  const { store } = useContext(Context);

  const photoSrc = employee.photo_url ? `${baseURL}${employee.photo_url}` : '/NotPhoto.png';

  return (
    <>
      <td className="align-middle">
        <Link to={`/employee/${employee.id}`} className="text-decoration-none fw-bold">
          {employee.name}
        </Link>
      </td>

      <td className="align-middle text-center">
        {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString('ru-RU') : '—'}
      </td>
      <td className="align-middle text-center">
        <Badge bg="info" className="me-1">
          {employee.position}
        </Badge>
      </td>
      <td className="align-middle text-center">
        {new Date(employee.hire_date).toLocaleDateString('ru-RU')}
      </td>

      <td className="align-middle text-center">
        <Badge
          bg={
            employee.status === 'работает'
              ? 'success'
              : employee.status === 'уволен'
              ? 'secondary'
              : employee.status === 'в отпуске'
              ? 'warning'
              : employee.status === 'в декрете'
              ? 'info'
              : 'primary'
          }>
          {employee.status}
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
        <img
          src={photoSrc}
          alt={employee.name}
          className="rounded-circle"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'cover',
            border: '2px solid #dee2e6',
          }}
        />
      </td>
    </>
  );
};

export default observer(EmployeeItem);
