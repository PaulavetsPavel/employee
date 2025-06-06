import $api from '../http';

export default class EmployeeService {
  static fetchEmployees(page, limit) {
    return $api.get(`/employees?page=${page}&limit=${limit}`);
  }

  static fetchEmployee(id) {
    return $api.get(`/employees/${id}`);
  }

  static createEmployee(data) {
    return $api.post('/employees', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  static updateEmployee(data) {
    return $api.put(`/employees/${data.id}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  static deleteEmployee(id) {
    return $api.delete(`/employees/${id}`);
  }
}
