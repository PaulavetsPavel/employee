import {

    Button,

    Card,
    Row,
    Col,

} from 'react-bootstrap';

const AdminPanel = () => {
    return (
        <>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-3">
                    <h5 className="card-title d-flex align-items-center">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Панель администратора
                    </h5>
                    <Row className="g-3 mt-2">
                        <Col md="auto">
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate("/logs")}
                                className="d-flex align-items-center"
                            >
                                <i className="bi bi-journal-text me-2"></i>
                                Логи системы
                            </Button>
                        </Col>
                        <Col md="auto">
                            <Button
                                variant="success"
                                onClick={() => navigate("/employees/add")}
                                className="d-flex align-items-center"
                            >
                                <i className="bi bi-person-plus me-2"></i>
                                Новый сотрудник
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}

export default AdminPanel