import { pool } from '../config/db.js';

class EmployeeService {
  async getAllEmployees() {
    const [employees] = await pool.query(`SELECT * FROM employees  `);
    return employees;
  }

  async getAllEmployeesOnPage(offset, limit) {
    const [employees] = await pool.query(
      `SELECT * FROM employees ORDER BY id LIMIT ${offset}, ${limit} `
    );
    return employees;
  }

  async getEmployeeById(id) {
    const [[employee]] = await pool.query(`SELECT * FROM employees WHERE id = ${id}  `);
    return employee;
  }
  async getEmployeeLikeName(name) {
    const [employee] = await pool.query(`SELECT * FROM employees WHERE name LIKE '${name}'`);

    return employee;
  }
  async getEmployeeLikePosition(position) {
    const [employee] = await pool.query(
      `SELECT * FROM employees WHERE position LIKE '${position}'`
    );

    return employee;
  }
  async getAllEmployeesSortBy(sort) {
    const [employees] = await pool.query(`SELECT * FROM employees ORDER BY ${sort} `);
    return employees;
  }

  async addEmployeeToDB(
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
    photo_url = '',
    created_by = 1
  ) {
    const query = `
    INSERT INTO employees (
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
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
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
      photo_url || null,
      created_by,
    ];

    const [{ insertId }] = await pool.query(query, values);

    const [[addedEmployee]] = await pool.query(`SELECT * FROM employees WHERE id = ?`, [insertId]);

    return addedEmployee;
  }

  async editEmployeeToDB(
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
    photo_url
  ) {
    const lastRow = await pool.query(
      `UPDATE employees SET name='${name}', birth_date='${birth_date}', department='${department}', position='${position}',
      salary='${salary}', status='${status}', hire_date='${hire_date}', contract_end='${contract_end}',
      vacation_start='${vacation_start}', vacation_end='${vacation_end}', education='${education}',
      passport_info='${passport_info}', registration_address='${registration_address}', photo_url='${photo_url}'
      WHERE id=${id}`
    );

    const updatedEmployee = await pool.query(`SELECT * FROM employees WHERE id = ${id}`);

    return updatedEmployee[0];
  }
  async removeEmployeeFromDB(id) {
    const [{ affectedRows }] = await pool.query(`DELETE FROM employees WHERE id=${id}`);

    return affectedRows;
  }
}

export default new EmployeeService();
