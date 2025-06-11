import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';

import { Button, ButtonGroup } from 'react-bootstrap';
import { EditEmployeeForm } from '../employee/forms/EditEmployeeForm';

const AdminButtonGroup = ({ id }) => {
  const navigate = useNavigate();
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (id) => {
    setEditEmployeeId(id);
    setShowEditModal(true);
  };

  const deleteEmployee = async (id) => {
    const res = await EmployeeService.deleteEmployee(id);
    if (res.status == 200) {
      navigate('/employee');
    }
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
          Редактировать
          <i className="bi bi-pencil ms-3"></i>
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => deleteEmployee(id)}
          title="Удалить"
          className="px-3">
          Удалить
          <i className="bi bi-trash ms-3"></i>
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
