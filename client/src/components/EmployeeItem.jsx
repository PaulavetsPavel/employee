import {
    Button,
    ButtonGroup,
    Badge,
} from 'react-bootstrap';

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
                    currency: 'RUB',
                    minimumFractionDigits: 0
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
                            border: '2px solid #dee2e6'
                        }}
                    />
                ) : (
                    <i className="bi bi-person-circle fs-4 text-secondary"></i>
                )}
            </td>
            <td className="align-middle text-center">
                <ButtonGroup size="sm">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        title="Редактировать"
                        className="px-3"
                    >
                        <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteEmployee(employee.id)}
                        title="Удалить"
                        className="px-3"
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                </ButtonGroup>
            </td>
        </>
    )
};

export default EmployeeItem