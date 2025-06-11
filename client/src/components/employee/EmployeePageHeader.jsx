import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';

import { Navbar, Button, Badge, Nav } from 'react-bootstrap';

const EmployeePageHeader = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const userLogout = async () => {
    const { data, status } = await AuthService.logout();

    if (status === 200) {
      store.setUser(null);
      store.setAuth(false);
      navigate('/login');
    }
    console.log(data.message);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4 p-3 shadow-sm rounded justify-content-between">
        <Navbar.Brand className="d-flex align-items-center">
          <i className="bi bi-person-circle fs-4 me-2"></i>
          <div>
            <h5 className="mb-0">{store.user.email}</h5>
            <Badge bg={store.user.role === 'admin' ? 'primary' : 'secondary'} className="mt-1">
              {store.user.role}
            </Badge>
          </div>
        </Navbar.Brand>

        {/* Центрированная кнопка */}
        <Button
          variant="outline-primary"
          onClick={() => navigate('/vacations')}
          className="mx-auto"
          style={{ minWidth: '200px' }}>
          🏖 График отпусков
        </Button>

        {/* Выход */}
        <Button variant="outline-danger" onClick={userLogout} className="d-flex align-items-center">
          <i className="bi bi-box-arrow-right me-2"></i>
          Выйти
        </Button>
      </Navbar>
    </>
  );
};

export default observer(EmployeePageHeader);
