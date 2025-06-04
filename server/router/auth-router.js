import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';
const Router = express.Router;

export const authRouter = new Router();

authRouter.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 20 }),
  authController.registration
);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/refresh', authController.refresh);
authRouter.get('/users', authMiddleware, authController.getUsers);
