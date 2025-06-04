import express from "express";
import { body } from "express-validator";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";
const Router = express.Router;

export const authRouter = new Router();

authRouter.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 20 }),
  userController.registration
);
authRouter.post("/login", userController.login);
authRouter.post("/logout", userController.logout);
authRouter.get("/refresh", userController.refresh);
authRouter.get("/users", authMiddleware, userController.getUsers);
