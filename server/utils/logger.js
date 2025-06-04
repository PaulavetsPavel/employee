import { pool } from '../config/db.js'
const logAction = async (adminId, action) => {
	await pool.query(`INSERT INTO logs (user_id, action) VALUES (?, ?)`, [
		adminId,
		action,
	])
}

export default logAction
