import authService from '../service/auth-service.js';
import { validationResult } from 'express-validator';

const COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
  httpOnly: true,
  secure: true, // только по https
  sameSite: 'None', // для кросс-доменных запросов
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const userData = await authService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, COOKIE_OPTIONS);
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, COOKIE_OPTIONS);
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Токен отсутствует' });
      }

      const affectedRows = await authService.logout(refreshToken);
      res.clearCookie('refreshToken', COOKIE_OPTIONS);

      return res.status(200).json({ message: 'Вы вышли из приложения.' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Ошибка при выходе' });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh токен отсутствует' });
      }

      const userData = await authService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, COOKIE_OPTIONS);

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await authService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка получения пользователей' });
    }
  }
}

export default new AuthController();
