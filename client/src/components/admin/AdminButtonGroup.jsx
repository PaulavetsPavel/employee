import { useState } from 'react';

import { Button, ButtonGroup } from 'react-bootstrap';
import { EditEmployeeForm } from '../employee/forms/EditEmployeeForm';

const AdminButtonGroup = ({ deleteEmployee, id }) => {
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (id) => {
    setEditEmployeeId(id);
    setShowEditModal(true);
  };

  return (
    <>
      <ButtonGroup size="sm">
        <Button
          variant="outline-primary"
          size="sm"
          title="Редактировать"
          className="px-3"
          onClick={() => handleEdit(id)}>
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
      <EditEmployeeForm
        employeeId={editEmployeeId}
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
      />
    </>
  );
};

export default AdminButtonGroup;
