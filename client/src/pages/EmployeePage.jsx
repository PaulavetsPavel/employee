import { useState, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Container, Card, } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import EmployeeService from '../services/EmployeeService';
import { Context } from '../main';
import EmployeePageHeader from '../components/EmployeePageHeader';
import AdminPanel from '../components/AdminPanel'
import PaginationComponent from '../components/PaginationComponent';

import SpinnerComponent from '../components/SpinnerComponent';
import EmployeeTable from '../components/EmployeeTable';

const LIMIT = 10



const EmployeePage = () => {
    const [page, setPage] = useState(1)
    const { store } = useContext(Context);

    const navigate = useNavigate();

    const getEmployees = async () => {
        try {
            const response = await EmployeeService.fetchEmployees(page, LIMIT);
            return response.data

        } catch (error) {
            console.log(error);
        }
    };

    const deleteEmployee = (id) => {
        console.log(id);
    }
    // const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["employees", page],
        queryFn: () => getEmployees(page, LIMIT)

    });


    return (
        <Container fluid className="px-lg-5" style={{ minHeight: '100vh', minWidth: '100vw' }}>
            {/* Шапка с информацией о пользователе */}
            <EmployeePageHeader />

            {isLoading ? (<SpinnerComponent />

            ) : (<main>

                {/* Админ-панель */}
                {'admin' === "admin" && (<AdminPanel />)}

                {/* Таблица сотрудников */}
                <Card className="mb-4 shadow-sm border-0">
                    <Card.Header className="bg-white border-0 py-3">
                        <h5 className="mb-0 d-flex align-items-center">
                            <i className="bi bi-people-fill me-2 text-primary"></i>
                            Список сотрудников
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <EmployeeTable employees={data} deleteEmployee={deleteEmployee} />
                    </Card.Body>
                </Card>

                {/* Пагинация */}
                <div className="d-flex justify-content-center mb-5">
                    <PaginationComponent page={page} setPage={setPage} dataLenght={data.length} />
                </div>
            </main>)
            }
        </Container >
    );
};

export default EmployeePage;
