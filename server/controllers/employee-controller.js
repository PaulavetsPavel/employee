import { log } from "console";
import employeeService from "../service/employee-service.js";
import logAction from "../utils/logger.js";
import fs from "fs";
import path from "path";
// import { __dirname } from "../utils/fileUtils.js";

class EmployeeController {
  async getEmployees(req, res) {
    console.log(req.query);

    try {
      const { page = 2, limit, searchField, search, sortBy } = req.query;
      const offset = (page - 1) * limit;
      let userData;

      if (searchField == "name") {
        userData = await employeeService.getEmployeeLikeName(search);
      } else if (searchField == "position") {
        userData = await employeeService.getEmployeeLikePosition(search);
      } else if (sortBy) {
        userData = await employeeService.getAllEmployeesSortBy(sortBy);
      } else {
        userData = await employeeService.getAllEmployeesOnPage(offset, limit);
      }
      // userData = await employeeService.getAllEmployees();

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
      const { name, position, hire_date, salary } = req.body;
      const created_by = 1;

      const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

      const employeeData = await employeeService.addEmployeeToDB(
        name,
        position,
        hire_date,
        salary,
        photo_url,
        created_by
      );

      // Логирование
      await logAction(1, `Added new employee with ID ${employeeData.id}`);
      return res.status(200).json(employeeData);
    } catch (error) {
      return res.status(500).json(error.messagee);
    }
  }
  async updateEmployee(req, res) {
    try {
      const { name, position, hire_date, salary } = req.body;

      const id = req.params.id;

      const employee = await employeeService.getEmployeeById(id);

      if (!employee) {
        return res.status(404).json({ error: "Сотрудник не найден." });
      }

      // Удаляем старое фото если загружаем новое
      let photo_url = employee.photo_url;
      if (req.file) {
        if (employee.photo_url) {
          const oldFilePath = path.join(
            __dirname,
            "../../uploads",
            employee.photo_url.split("/").pop()
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        photo_url = `/uploads/${req.file.filename}`;
      }

      const [employeeData] = await employeeService.editEmployeeToDB(
        id,
        name,
        position,
        hire_date,
        salary,
        photo_url
      );

      //Логирование
      await logAction(1, `Updated employee with ID ${id}`);
      return res.status(200).json(employeeData);
    } catch (error) {
      console.log(error);

      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json(error.messagee);
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
      throw new Error("Ошибка удаления");
    } catch (error) {
      console.log(error);

      return res.status(500).json(error.messagee);
    }
  }
}

export default new EmployeeController();
