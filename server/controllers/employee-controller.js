import employeeService from '../service/employee-service.js';
import logAction from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
// import { __dirname } from "../utils/fileUtils.js";

class EmployeeController {
  async getEmployees(req, res) {
    try {
      // const { page = 2, limit, search, sortBy } = req.query;
      // const offset = (page - 1) * limit;
      // let userData;

      // if (search) {
      //   userData = await employeeService.getEmployeeLikeName(search);
      // } else if (sortBy) {
      //   userData = await employeeService.getAllEmployeesSortBy(sortBy);
      // } else {
      //   userData = await employeeService.getAllEmployeesOnPage(offset, limit);
      // }
      const userData = await employeeService.getAllEmployees();

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json(error.messagee);
    }
  }
  async getEmployee(req, res) {
    try {
      const id = req.params.id;

      const userData = await employeeService.getEmployeeById(id);

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json(error.messagee);
    }
  }

  async createEmployee(req, res) {
    try {
      const {
        name,
        position,
        hire_date,
        contract_end,
        status,
        salary,
        birth_date,
        vacation_start,
        vacation_end,
        education,
        passport_info,
        registration_address,
        department,
      } = req.body;

      const created_by = 1;
      const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

      const employeeData = await employeeService.addEmployeeToDB(
        name,
        position,
        hire_date,
        contract_end,
        status,
        salary,
        birth_date,
        vacation_start,
        vacation_end,
        education,
        passport_info,
        registration_address,
        department,
        photo_url,
        created_by
      );

      await logAction(created_by, `Добавлен сотрудник с ID ${employeeData.id}`);

      return res.status(200).json(employeeData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message || 'Ошибка сервера' });
    }
  }

  async updateEmployee(req, res) {
    try {
      const {
        name,
        position,
        hire_date,
        contract_end,
        status,
        salary,
        birth_date,
        vacation_start,
        vacation_end,
        education,
        passport_info,
        registration_address,
        department,
      } = req.body;

      const id = req.params.id;
      const employee = await employeeService.getEmployeeById(id);

      if (!employee) {
        return res.status(404).json({ error: 'Сотрудник не найден.' });
      }

      // Фотография
      let photo_url = employee.photo_url;

      if (req.file) {
        // Удаляем старое фото
        if (photo_url) {
          const oldFilePath = path.join(__dirname, '../../uploads', photo_url.split('/').pop());
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        // Устанавливаем новое фото
        photo_url = `/uploads/${req.file.filename}`;
      }

      const [employeeData] = await employeeService.editEmployeeToDB(
        id,
        name,
        birth_date,
        department,
        position,
        salary,
        status,
        hire_date,
        contract_end,
        vacation_start,
        vacation_end,
        education,
        passport_info,
        registration_address,
        photo_url // ← сохраняем либо старое, либо новое
      );

      await logAction(1, `Обновлены данные сотрудника ID ${id}`);
      return res.status(200).json(employeeData);
    } catch (error) {
      console.error(error);
      if (req.file) {
        fs.unlinkSync(req.file.path); // если ошибка — удалим временный файл
      }
      return res.status(500).json({ message: error.message || 'Ошибка сервера' });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const id = req.params.id;

      const affectedRows = await employeeService.removeEmployeeFromDB(id);

      if (affectedRows) {
        await logAction(1, `Deleted employee with ID ${id}`);
        return res.status(200).json(affectedRows);
      }
      throw new Error('Ошибка удаления');
    } catch (error) {
      console.log(error);

      return res.status(500).json(error.messagee);
    }
  }
}

export default new EmployeeController();
