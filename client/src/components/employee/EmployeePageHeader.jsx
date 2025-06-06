import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { Context } from '../../main';

import { Navbar, Button, Badge } from 'react-bootstrap';

const EmployeePageHeader = ({ currentUser }) => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const userLogout = async () => {
    const { data, status } = await AuthService.logout();

    if (status === 200) {
      store.setUser(null);
      navigate('/login');
    }
    console.log(data.message);
  };
  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4 p-3 shadow-sm rounded">
        <Navbar.Brand className="me-auto d-flex align-items-center">
          <i className="bi bi-person-circle fs-4 me-2"></i>
          <div>
            <h5 className="mb-0">{currentUser.email}</h5>
            <Badge bg={currentUser.role === 'admin' ? 'primary' : 'secondary'} className="mt-1">
              {currentUser.role}
            </Badge>
          </div>
        </Navbar.Brand>
        <Button variant="outline-danger" onClick={userLogout} className="d-flex align-items-center">
          <i className="bi bi-box-arrow-right me-2"></i>
          Выйти
        </Button>
      </Navbar>
    </>
  );
};

export default EmployeePageHeader;
