import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
// import bcrypt from 'bcrypt';
import tokenService from './token-service.js';

class AuthService {
  async registration(email, password) {
    const [[candidate]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // проверка существует ли пользователь в бд
    if (candidate) {
      throw new Error('Пользователь уже существует. Пожалуйста авторизируйтесь.');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 — "соль" (число итераций)

    // добавление пользователя в бд
    const [lastRow] = await pool.query(
      'INSERT INTO `users` (`email` , `password_hash` , `role` ) VALUES (?, ?, ?) ',
      [email, hashedPassword, 'user']
    );
    // получение последнего добавленного пользователя из бд
    const [[addedUser]] = await pool.query('SELECT * FROM users WHERE id = ? ', [lastRow.insertId]);

    const tokens = tokenService.generateTokens({ ...addedUser });

    // добавление токена в бд
    await tokenService.saveToken(addedUser.id, tokens.refreshToken);

    return { ...tokens, user: { ...addedUser } };
  }

  async login(email, password) {
    const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      throw new Error("Пользователь с таким Email'ом не найден. Пожалуйста зарегистрируйтесь. ");
    }
    const isPassEqual = await bcrypt.compare(password, user.password_hash);

    if (!isPassEqual) {
      throw new Error('Неверный пароль.');
    }

    const tokens = tokenService.generateTokens({ ...user });

    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: { ...user } };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('Пользователь не авторизирован.');
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw new Error('Пользователь не авторизирован.');
    }

    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [tokenFromDB.user_id]);

    const tokens = tokenService.generateTokens({ ...user });

    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: { ...user } };
  }

  async getAllUsers() {
    const [users] = await pool.query('SELECT * FROM users ');
    return users;
  }
}

export default new AuthService();
