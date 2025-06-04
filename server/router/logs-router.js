import express from 'express'
import logController from '../controllers/log-controller.js'
import adminMiddleware from '../middleware/admin-middleware.js'
import authMiddleware from '../middleware/auth-middleware.js'

const Router = express.Router

export const logRouter = new Router()

logRouter.get(
	'/logs',
	authMiddleware,
	adminMiddleware,
	logController.getAllLogs
)
