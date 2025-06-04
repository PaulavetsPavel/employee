import {

    Navbar,
    Button,

    Badge,

} from 'react-bootstrap';

const EmployeePageHeader = () => {
    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-4 p-3 shadow-sm rounded">
                <Navbar.Brand className="me-auto d-flex align-items-center">
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    <div>
                        <h5 className="mb-0">Admin</h5>
                        <Badge bg={'admin' === 'admin' ? 'primary' : 'secondary'} className="mt-1">
                            admin
                        </Badge>
                    </div>
                </Navbar.Brand>
                <Button
                    variant="outline-danger"
                    onClick={() => {
                        AuthService.logout();
                        navigate("/login");
                    }}
                    className="d-flex align-items-center"
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Выйти
                </Button>
            </Navbar>


        </>
    )
}

export default EmployeePageHeader