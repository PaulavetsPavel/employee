import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import AuthService from '../services/AuthService';
import { Context } from '../main';

import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { store } = useContext(Context);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Простая валидация
    if (!email || !password) {
      setError('Пожалуйста заполните необходимые поля.');
      return;
    }

    if (!email.includes('@')) {
      setError('Не корректный Email.');
      return;
    }

    try {
      const { data, status } = await AuthService.login({ email, password });

      if (status === 200 && data.user) {
        store.setUser(data.user);
        store.setAuth(true);
        console.log(store.isAuth);
      }
    } catch (error) {
      setError(error.response.data);
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    const check = async () => {
      await store.checkAuth();
      console.log('checkAuth завершён', store.isAuth);
    };

    check();
  }, []);

  useEffect(() => {
    console.log('Auth статус изменился:', store.isAuth);

    if (store.isAuth) {
      console.log('Переход на /employee');
      navigate('/employee');
    }
  }, [store.isAuth]);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Вход</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={isLoading}>
              {store.isLoading ? 'Входим...' : 'Войти'}
            </Button>

            <div className="text-center">
              <span>Нет аккаунта? </span>
              <Link to="/register" className="text-decoration-none">
                Зарегистрируйтесь
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default observer(LoginPage);
