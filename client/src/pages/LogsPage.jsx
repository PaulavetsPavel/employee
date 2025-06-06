import { useState, useContext } from "react"

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { Table, Card, Button, Navbar, Container } from 'react-bootstrap';

import LogService from "../services/LogService";
import PaginationComponent from '../components/PaginationComponent';

import SpinnerComponent from '../components/SpinnerComponent';

import { Context } from '../main';

const LIMIT = 20

const LogsPage = () => {

    const [page, setPage] = useState(1);
    const { store } = useContext(Context);

    const navigate = useNavigate();

    const currentUser = store.getUser();
    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString('ru-RU', options);
    };

    const getLogs = async () => {
        try {
            const response = await LogService.fetchLogs(page, LIMIT);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['logs', page],
        queryFn: () => getLogs(page, LIMIT),
    });

    const handleLogout = () => {
        navigate(-1); // Перенаправление на страницу входа
    };

    if (!currentUser) navigate('/login');

    return (
        <>
            {isLoading ? (
                <SpinnerComponent />
            ) : (
                <main>

                    {/* Навигационная панель с кнопкой выхода */}
                    <Navbar bg="light" variant="light" className="mb-4 shadow-sm">
                        <Container>
                            <Navbar.Brand>Журнал событий</Navbar.Brand>
                            <Button
                                variant="outline-danger"
                                onClick={handleLogout}
                                className="ms-auto"
                            >
                                Выйти
                            </Button>
                        </Container>
                    </Navbar>

                    <Container className="py-4" style={{ minHeight: '100vh', minWidth: '100vw' }}>
                        <Card className="mb-4 shadow-sm">
                            <Card.Body>


                                <Table striped bordered hover responsive>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Пользователь</th>
                                            <th>Действие</th>
                                            <th>Дата</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map(log => (
                                            <tr key={log.id}>
                                                <td>{log.id}</td>
                                                <td>ID: {log.user_id}</td>
                                                <td>{log.action}</td>
                                                <td>{formatDateTime(log.timestamp)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {/* Пагинация */}
                                <div className="d-flex justify-content-center mb-5">
                                    <PaginationComponent page={page} setPage={setPage} dataLenght={data.length} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Container>
                </main>)}
        </>
    )
}

export default LogsPage