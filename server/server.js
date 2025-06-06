import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error-middleware.js";
import { authRouter } from "./router/auth-router.js";
import { employeesRouter } from "./router/employees-router.js";
import { logRouter } from "./router/logs-router.js";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.APP_PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRouter);
app.use("/api", employeesRouter);
app.use("/api", logRouter);
app.use(errorMiddleware);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
