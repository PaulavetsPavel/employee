import authService from '../service/auth-service.js';
import { validationResult } from 'express-validator';

class AuthController {
  async registration(req, res) {
    try {
      // валидация данных
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors.errors);
      }
      const { email, password } = req.body;
      const userData = await authService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json(userData);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const affectedRows = await authService.logout(refreshToken);
      if (affectedRows) {
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Вы вышли из приложения.' });
      } else {
        throw new Error('Ошибка.');
      }
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error });
    }
  }
  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getUsers(req, res) {
    try {
      const userData = await authService.getAllUsers();
      return res.status(200).json(userData);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}

export default new AuthController();
