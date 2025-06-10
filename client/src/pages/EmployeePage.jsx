import { useState, useContext, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import EmployeeService from '../services/EmployeeService';
import { Context } from '../main';
import EmployeePageHeader from '../components/employee/EmployeePageHeader';
import AdminPanel from '../components/admin/AdminPanel';
import PaginationComponent from '../components/PaginationComponent';

import SpinnerComponent from '../components/SpinnerComponent';
import EmployeeTable from '../components/employee/EmployeeTable';
import SearchEmployeeElement from '../components/employee/SearchEmployeeElement';
import SortEmployeeElement from '../components/employee/SortEmployeeElement';
import BirthdayToast from '../components/BirthdayToast';

const LIMIT = 10;

const EmployeePage = () => {
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  //   Поиск
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name'); // 'name' или 'position'

  // Сортировка
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' или 'desc'

  const { store } = useContext(Context);

  const navigate = useNavigate();

  const getEmployees = async () => {
    try {
      const response = await EmployeeService.fetchEmployees();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page],
    queryFn: () => getEmployees(),
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

  const filteredEmployees = useMemo(() => {
    if (!data) return [];

    const search = searchTerm.toLowerCase();

    const filtered = data.filter((employee) => {
      const fieldValue = employee[searchField]?.toLowerCase() || '';
      return fieldValue.includes(search);
    });

    // Сортировка
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Обработка разных типов данных
      if (sortField === 'name' || sortField === 'position') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortField === 'hire_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (sortField === 'salary') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, searchTerm, searchField, sortField, sortOrder]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, page]);

  const deleteEmployee = async (id) => {
    mutation.mutate(id);
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, searchField]);

  useEffect(() => {
    setSearchTerm('');
    setPage(1);
  }, [searchField]);

  // показать уведомление если завтра у сотрудника день рождения
  useEffect(() => {
    if (!data) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const format = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getDate()}-${date.getMonth() + 1}`;
    };

    const tomorrowStr = `${tomorrow.getDate()}-${tomorrow.getMonth() + 1}`;

    data.forEach((employee) => {
      if (!employee.birth_date) return;

      const birthDayMonth = format(employee.birth_date);

      if (birthDayMonth === tomorrowStr) {
        toast(({ closeToast }) => <BirthdayToast name={employee.name} closeToast={closeToast} />, {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        });
      }
    });
  }, [data]);

  if (!store.isAuth) navigate('/login');

  return (
    <Container fluid className="px-lg-5" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      {/* Шапка с информацией о пользователе */}
      {store.user && <EmployeePageHeader />}

      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <main>
          {/* Админ-панель */}
          {store.user.role == 'admin' && <AdminPanel setShowAddModal={setShowAddModal} />}

          <div className="d-flex flex-wrap justify-content-between align-items-center">
            {/* Блок поиска */}
            <SearchEmployeeElement
              searchTerm={searchTerm}
              searchField={searchField}
              setSearchTerm={setSearchTerm}
              setSearchField={setSearchField}
            />

            {/* Блок сортировки */}
            <SortEmployeeElement
              sortField={sortField}
              sortOrder={sortOrder}
              setSortField={setSortField}
              setSortOrder={setSortOrder}
            />
          </div>

          {/* Таблица сотрудников */}
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Список сотрудников
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {store.user && (
                <EmployeeTable employees={paginatedEmployees} deleteEmployee={deleteEmployee} />
              )}
            </Card.Body>
          </Card>

          {/* Пагинация */}
          <div className="d-flex justify-content-center mb-5">
            <PaginationComponent
              page={page}
              setPage={setPage}
              dataLenght={filteredEmployees.length}
            />
          </div>
        </main>
      )}
      <ToastContainer
        position="top-right" // где будет показываться
        autoClose={1000} // через сколько мс закрывать
        hideProgressBar={false} // показывать прогресс-бар
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default observer(EmployeePage);
