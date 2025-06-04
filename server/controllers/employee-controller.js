import employeeService from '../service/employee-service.js';
import logAction from '../utils/logger.js';

class EmployeeController {
  async getEmployees(req, res) {
    try {
      const { page = 2, limit, search, sortBy } = req.query;
      const offset = (page - 1) * limit;
      let userData;

      if (search) {
        userData = await employeeService.getEmployeeLikeName(search);
      } else if (sortBy) {
        userData = await employeeService.getAllEmployeesSortBy(sortBy);
      } else {
        userData = await employeeService.getAllEmployeesOnPage(offset, limit);
      }
      // userData = await employeeService.getAllEmployees();

      return res.json(userData);
    } catch (error) {
      return res.status(500).json(error.messagee);
    }
  }
  async getEmployee(req, res) {
    try {
      const id = req.params.id;

      const userData = await employeeService.getEmployeeById(id);

      return res.json(userData);
    } catch (error) {
      return res.status(500).json(error.messagee);
    }
  }

  async createEmployee(req, res) {
    try {
      const { name, position, hire_date, salary, photo_url } = req.body;
      const created_by = 1;
      const employeeData = await employeeService.addEmployeeToDB(
        name,
        position,
        hire_date,
        salary,
        photo_url,
        created_by
      );

      // Логирование
      await logAction(1, `Added new employee with ID ${employeeData[0].id}`);
      return res.json(employeeData);
    } catch (error) {
      return res.status(500).json(error.messagee);
    }
  }
  async updateEmployee(req, res) {
    try {
      const { name, position, hire_date, salary, photo_url } = req.body;
      console.log(req.body);

      const id = req.params.id;
      const employeeData = await employeeService.editEmployeeToDB(
        id,
        name,
        position,
        hire_date,
        salary,
        photo_url
      );
      //Логирование
      await logAction(1, `Updated employee with ID ${id}`);
      return res.json(employeeData);
    } catch (error) {
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
      throw new Error('Ошибка удаления');
    } catch (error) {
      console.log(error);

      return res.status(500).json(error.messagee);
    }
  }
}

export default new EmployeeController();
