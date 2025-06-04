import express from "express";

import employeeController from "../controllers/employee-controller.js";
import adminMiddleware from "../middleware/admin-middleware.js";
import authMiddleware from "../middleware/auth-middleware.js";

const Router = express.Router;

export const employeesRouter = new Router();

employeesRouter.get(
  "/employees",
  // authMiddleware,

  employeeController.getEmployees
);
employeesRouter.get(
  "/employees/:id",
  // authMiddleware,

  employeeController.getEmployee
);

employeesRouter.post(
  "/employees",
  authMiddleware,
  adminMiddleware,
  employeeController.createEmployee
);
employeesRouter.put(
  "/employees/:id",
  authMiddleware,
  adminMiddleware,
  employeeController.updateEmployee
);
employeesRouter.delete(
  "/employees/:id",
  authMiddleware,
  adminMiddleware,
  employeeController.deleteEmployee
);
