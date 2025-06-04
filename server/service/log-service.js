import { pool } from "../config/db.js";

class LogService {
  async getAllLogsFromDB(offset,limit) {
    const [logs] = await pool.query(`SELECT * FROM logs ORDER BY id LIMIT ${offset}, ${limit} `);
    return logs;
  }
}
export default new LogService();
