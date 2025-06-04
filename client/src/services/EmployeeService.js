import $api from "../http";

export default class EmployeeService {
  static fetchEmployees(page, limit) {
    return $api.get(`/employees?page=${page}&limit=${limit}`);
  }
  static fetchEmployee(id) {
    return $api.get(`/employees/${id}`);
  }

  static createEmployee(data) {
    return $api.post("/employees", data);
  }
  static updateEmployee(data) {
    return $api.put(`/employees/${data.id}`, data);
  }
  static deleteEmployee(id) {
    return $api.delete(`/employees/${id}`);
  }
}
