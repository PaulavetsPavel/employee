import { useEffect, useContext } from 'react';
import { Context } from './main';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeePage from './pages/EmployeePage';
import LogsPage from './pages/LogsPage';

const App = () => {
  const { store } = useContext(Context);

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/employee"
        element={store.isAuth ? <EmployeePage /> : <Navigate to="/login" />}
      />
      <Route path="/logs" element={store.isAuth ? <LogsPage /> : <Navigate to="/login" />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default observer(App);
