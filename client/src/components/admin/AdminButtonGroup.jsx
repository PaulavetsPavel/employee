import { Button, ButtonGroup } from 'react-bootstrap';

const AdminButtonGroup = ({ deleteEmployee, id }) => {
  return (
    <ButtonGroup size="sm">
      <Button variant="outline-primary" size="sm" title="Редактировать" className="px-3">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => deleteEmployee(id)}
        title="Удалить"
        className="px-3">
        <i className="bi bi-trash"></i>
      </Button>
    </ButtonGroup>
  );
};

export default AdminButtonGroup;
