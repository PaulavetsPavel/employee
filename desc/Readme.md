1. Структура базы данных (MySQL)
   -- Таблица пользователей
   CREATE TABLE users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   email VARCHAR(255) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   role ENUM('User', 'Admin') DEFAULT 'User',
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

-- Таблица токенов восстановления пароля
CREATE TABLE password_resets (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
token VARCHAR(255) NOT NULL,
expires_at DATETIME NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SQL: структура таблицы employees
CREATE TABLE employees (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
position VARCHAR(255),
department VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. API эндпоинты
Метод Endpoint Описание Доступ
POST /auth/register Регистрация нового пользователя Публично
POST /auth/login Авторизация и получение JWT Публично
POST /auth/forgot-password Отправка email с токеном Публично
POST /auth/reset-password Сброс пароля по токену Публично
GET /employees Просмотр списка сотрудников User/Admin
POST /employees Добавить сотрудника Admin
PUT /employees/:id Обновить данные сотрудника Admin
DELETE /employees/:id Удалить сотрудника Admin
GET /logs Получить системные логи Admin



1. Инициализация проекта
   mkdir employee-manager-backend
   cd employee-manager-backend
   npm init -y
   npm install express mysql2 bcrypt jsonwebtoken nodemailer dotenv cors

2. Создай структуру проекта:

employee-manager-backend/
├── controllers/
├── routes/
├── middleware/
├── models/
├── utils/
├── .env
├── app.js
└── server.js
📄 .env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=employee_manager

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_email_password

📄 models/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});

module.exports = pool;

🧾 3. Регистрация и вход
📄 routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
require('dotenv').config();

// Регистрация
router.post('/register', async (req, res) => {
const { email, password } = req.body;
try {
const [existing] = await pool.query('SELECT _ FROM users WHERE email = ?', [email]);
if (existing.length > 0) return res.status(400).json({ message: 'Email already in use' });
const hashed = await bcrypt.hash(password, 10);
await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
res.status(201).json({ message: 'User registered' });
} catch (err) {
res.status(500).json({ message: 'Registration error', error: err });
}
});
// Вход
router.post('/login', async (req, res) => {
const { email, password } = req.body;
try {
const [users] = await pool.query('SELECT _ FROM users WHERE email = ?', [email]);
const user = users[0];
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
res.json({ token });
} catch (err) {
res.status(500).json({ message: 'Login error', error: err });
}
});

module.exports = router;

🛡️ 4. JWT-защита маршрутов
📄 middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'Missing token' });

const token = authHeader.split(' ')[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload;
next();
} catch (err) {
return res.status(403).json({ message: 'Invalid or expired token' });
}
};

const authorize = (roles = []) => {
return (req, res, next) => {
if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
next();
};
};

module.exports = { authenticate, authorize };

🔐 5. Восстановление пароля по email
📄 utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: process.env.SMTP_PORT,
secure: false,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
}
});

const sendResetEmail = (to, token) => {
const url = `http://localhost:5173/reset-password?token=${token}`;
return transporter.sendMail({
from: process.env.SMTP_USER,
to,
subject: 'Password Reset',
html: `<p>Click <a href="${url}">here</a> to reset your password. This link is valid for 1 hour.</p>`
});
};

module.exports = sendResetEmail;

📄 routes/password.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../models/db');
const sendResetEmail = require('../utils/mailer');

router.post('/forgot-password', async (req, res) => {
const { email } = req.body;
const [users] = await pool.query('SELECT \* FROM users WHERE email = ?', [email]);
if (!users.length) return res.status(400).json({ message: 'Email not found' });

const token = crypto.randomBytes(32).toString('hex');
const expires = new Date(Date.now() + 3600000); // 1 час

await pool.query('DELETE FROM password_resets WHERE user_id = ?', [users[0].id]); // очистка предыдущих токенов
await pool.query('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)', [users[0].id, token, expires]);

await sendResetEmail(email, token);
res.json({ message: 'Reset link sent' });
});

router.post('/reset-password', async (req, res) => {
const { token, newPassword } = req.body;
const [records] = await pool.query('SELECT \* FROM password_resets WHERE token = ?', [token]);
const record = records[0];

if (!record || new Date(record.expires_at) < new Date()) {
return res.status(400).json({ message: 'Invalid or expired token' });
}

const hashed = await bcrypt.hash(newPassword, 10);
await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, record.user_id]);
await pool.query('DELETE FROM password_resets WHERE user_id = ?', [record.user_id]);

res.json({ message: 'Password updated' });
});

module.exports = router;

📄 app.js и server.js
app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/auth', passwordRoutes);

module.exports = app;

server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

✅ Шаги по настройке frontend
📦 1. Инициализация Vite-проекта
npm create vite@latest employee-manager-frontend --template react
cd employee-manager-frontend
npm install
npm install react-router-dom axios bootstrap

📄 2. Структура проекта (упрощённо)
employee-manager-frontend/
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── App.jsx
│ └── main.jsx
├── index.html
└── package.json

3. Подключение Bootstrap
В файле src/main.jsx добавь:
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<App />
</React.StrictMode>,
);

🔐 4. Реализация ключевых страниц (регистрация, вход, сброс пароля)
Создадим по порядку:
src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');

const handleLogin = async (e) => {
e.preventDefault();
try {
const res = await axios.post('http://localhost:5000/auth/login', { email, password });
localStorage.setItem('token', res.data.token);
setMessage('Успешный вход!');
// редирект по роли?
} catch (err) {
setMessage('Ошибка входа: ' + err.response?.data?.message);
}
};

return (
<div className="container mt-5">
<h2>Вход</h2>
<form onSubmit={handleLogin}>
<div className="mb-3">
<label className="form-label">Email:</label>
<input type="email" className="form-control" onChange={e => setEmail(e.target.value)} required />
</div>
<div className="mb-3">
<label className="form-label">Пароль:</label>
<input type="password" className="form-control" onChange={e => setPassword(e.target.value)} required />
</div>
<button type="submit" className="btn btn-primary">Войти</button>
</form>
<p className="mt-3 text-danger">{message}</p>
</div>
);
}

📄 src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');

const handleRegister = async (e) => {
e.preventDefault();
try {
await axios.post('http://localhost:5000/auth/register', { email, password });
setMessage('Успешная регистрация!');
} catch (err) {
setMessage('Ошибка регистрации: ' + err.response?.data?.message);
}
};

return (
<div className="container mt-5">
<h2>Регистрация</h2>
<form onSubmit={handleRegister}>
<div className="mb-3">
<label className="form-label">Email:</label>
<input type="email" className="form-control" onChange={e => setEmail(e.target.value)} required />
</div>
<div className="mb-3">
<label className="form-label">Пароль:</label>
<input type="password" className="form-control" onChange={e => setPassword(e.target.value)} required />
</div>
<button type="submit" className="btn btn-success">Зарегистрироваться</button>
</form>
<p className="mt-3 text-danger">{message}</p>
</div>
);
}

📄 src/pages/ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');

const handleSend = async (e) => {
e.preventDefault();
try {
await axios.post('http://localhost:5000/auth/forgot-password', { email });
setMessage('Письмо отправлено, проверьте почту.');
} catch (err) {
setMessage('Ошибка: ' + err.response?.data?.message);
}
};

return (
<div className="container mt-5">
<h2>Сброс пароля</h2>
<form onSubmit={handleSend}>
<div className="mb-3">
<label className="form-label">Email:</label>
<input type="email" className="form-control" onChange={e => setEmail(e.target.value)} required />
</div>
<button type="submit" className="btn btn-warning">Отправить ссылку</button>
</form>
<p className="mt-3 text-success">{message}</p>
</div>
);
}

📄 src/pages/ResetPassword.jsx

import { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
const [searchParams] = useSearchParams();
const token = searchParams.get('token');

const [password, setPassword] = useState('');
const [message, setMessage] = useState('');

const handleReset = async (e) => {
e.preventDefault();
try {
await axios.post('http://localhost:5000/auth/reset-password', { token, newPassword: password });
setMessage('Пароль обновлён!');
} catch (err) {
setMessage('Ошибка: ' + err.response?.data?.message);
}
};

return (
<div className="container mt-5">
<h2>Введите новый пароль</h2>
<form onSubmit={handleReset}>
<div className="mb-3">
<label className="form-label">Новый пароль:</label>
<input type="password" className="form-control" onChange={e => setPassword(e.target.value)} required />
</div>
<button type="submit" className="btn btn-success">Сбросить</button>
</form>
<p className="mt-3">{message}</p>
</div>
);
}

src/App.jsx — роутинг
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
return (
<Router>
<Routes>
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
</Routes>
</Router>
);
}

export default App;

6. CRUD сотрудников с разграничением ролей (User/Admin)
📄 routes/employees.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, authorize } = require('../middleware/auth');

// Получить всех сотрудников (User/Admin)
router.get('/', authenticate, async (req, res) => {
try {
const [rows] = await pool.query('SELECT \* FROM employees');
res.json(rows);
} catch (err) {
res.status(500).json({ message: 'Ошибка получения сотрудников' });
}
});

// Создать нового сотрудника (Admin)
router.post('/', authenticate, authorize(['Admin']), async (req, res) => {
const { name, position, department } = req.body;
try {
await pool.query(
'INSERT INTO employees (name, position, department) VALUES (?, ?, ?)',
[name, position, department]
);
res.status(201).json({ message: 'Сотрудник добавлен' });
} catch (err) {
res.status(500).json({ message: 'Ошибка при добавлении сотрудника' });
}
});

// Обновить сотрудника (Admin)
router.put('/:id', authenticate, authorize(['Admin']), async (req, res) => {
const { id } = req.params;
const { name, position, department } = req.body;
try {
await pool.query(
'UPDATE employees SET name = ?, position = ?, department = ? WHERE id = ?',
[name, position, department, id]
);
res.json({ message: 'Сотрудник обновлён' });
} catch (err) {
res.status(500).json({ message: 'Ошибка обновления' });
}
});

// Удалить сотрудника (Admin)
router.delete('/:id', authenticate, authorize(['Admin']), async (req, res) => {
const { id } = req.params;
try {
await pool.query('DELETE FROM employees WHERE id = ?', [id]);
res.json({ message: 'Сотрудник удалён' });
} catch (err) {
res.status(500).json({ message: 'Ошибка удаления' });
}
});

module.exports = router;
Не забудь подключить этот роут в app.js:
const employeeRoutes = require('./routes/employees');
app.use('/employees', employeeRoutes);

Frontend: Страница сотрудников
📄 src/pages/Employees.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employees() {
const [employees, setEmployees] = useState([]);
const [role, setRole] = useState('');
const [error, setError] = useState('');

useEffect(() => {
const token = localStorage.getItem('token');
if (!token) return;

    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);

        // Декодировать роль из токена (для отображения кнопок)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
      } catch (err) {
        setError('Ошибка загрузки данных');
      }
    };

    fetchEmployees();

}, []);

return (
<div className="container mt-5">
<h2>Сотрудники</h2>
{error && <p className="text-danger">{error}</p>}

      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Имя</th>
            <th>Должность</th>
            <th>Отдел</th>
            {role === 'Admin' && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              {role === 'Admin' && (
                <td>
                  <button className="btn btn-sm btn-warning me-2">✏️</button>
                  <button className="btn btn-sm btn-danger">🗑️</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

);
}
➕ Добавление в роутинг App.jsx
import Employees from './pages/Employees';

<Routes>
  {/* ...другие роуты */}
  <Route path="/employees" element={<Employees />} />
</Routes>
