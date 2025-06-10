// pages/EmployeeProfile.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  ListGroup,
  Image,
  Button,
} from 'react-bootstrap';

import EmployeeService from '../../services/EmployeeService';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getEmployee = async () => {
    try {
      const { data } = await EmployeeService.fetchEmployee(id);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployee(),
  });

  if (isLoading || !employee) {
    return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  }

  return (
    <Container className="mt-4" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <h3 className="mb-4 text-center">Карточка сотрудника</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <Image
                src={employee.photo_url ? `${baseURL}${employee.photo_url}` : '/NotPhoto.png'}
                roundedCircle
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h5 className="mt-3">{employee.name}</h5>
              <Badge bg="info">{employee.position}</Badge>
            </Col>

            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Отдел:</strong> {employee.department || '—'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Дата рождения:</strong>{' '}
                  {employee.birth_date
                    ? new Date(employee.birth_date).toLocaleDateString('ru-RU')
                    : '—'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Дата приёма:</strong>{' '}
                  {new Date(employee.hire_date).toLocaleDateString('ru-RU')}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Окончание контракта:</strong>{' '}
                  {employee.contract_end
                    ? new Date(employee.contract_end).toLocaleDateString('ru-RU')
                    : '—'}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Образование:</strong> {employee.education || '—'}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Паспортные данные:</strong> {employee.passport_info || '—'}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Адрес прописки:</strong> {employee.registration_address || '—'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Статус:</strong>{' '}
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
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Зарплата:</strong>{' '}
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'BYN',
                    minimumFractionDigits: 0,
                  }).format(employee.salary)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Отпуск:</strong>{' '}
                  {employee.vacation_start && employee.vacation_end
                    ? `${new Date(employee.vacation_start).toLocaleDateString(
                        'ru-RU'
                      )} — ${new Date(employee.vacation_end).toLocaleDateString('ru-RU')}`
                    : '—'}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-4">
        <Button variant="secondary" onClick={() => navigate('/employee')}>
          Закрыть
        </Button>
      </div>
    </Container>
  );
};

export default EmployeeProfile;
