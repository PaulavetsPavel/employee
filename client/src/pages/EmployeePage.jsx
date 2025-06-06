import { useState, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import EmployeeService from '../services/EmployeeService';
import { Context } from '../main';
import EmployeePageHeader from '../components/employee/EmployeePageHeader';
import AdminPanel from '../components/admin/AdminPanel';
import PaginationComponent from '../components/PaginationComponent';

import SpinnerComponent from '../components/SpinnerComponent';
import EmployeeTable from '../components/employee/EmployeeTable';

const LIMIT = 10;

const EmployeePage = () => {
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { store } = useContext(Context);

  const navigate = useNavigate();

  const currentUser = store.getUser();

  const getEmployees = async () => {
    try {
      const response = await EmployeeService.fetchEmployees(page, LIMIT);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page],
    queryFn: () => getEmployees(page, LIMIT),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => EmployeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      reset();
      onHide();
    },
    onError: (error) => {
      setServerError(error.response?.data?.message);
    },
  });

  const deleteEmployee = async (id) => {
    mutation.mutate(id);
  };

  if (!currentUser) navigate('/login');

  return (
    <Container fluid className="px-lg-5" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      {/* Шапка с информацией о пользователе */}
      {currentUser && <EmployeePageHeader currentUser={currentUser} />}

      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <main>
          {/* Админ-панель */}
          {currentUser.role == 'admin' && <AdminPanel setShowAddModal={setShowAddModal} />}

          {/* Таблица сотрудников */}
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Список сотрудников
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {currentUser && <EmployeeTable employees={data} deleteEmployee={deleteEmployee} />}
            </Card.Body>
          </Card>

          {/* Пагинация */}
          <div className="d-flex justify-content-center mb-5">
            <PaginationComponent page={page} setPage={setPage} dataLenght={data.length} />
          </div>
        </main>
      )}
    </Container>
  );
};

export default EmployeePage;
