import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeePage from './pages/EmployeePage';
import LogsPage from './pages/LogsPage';



const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/employee' element={<EmployeePage />} />
        <Route path='/logs' element={<LogsPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
