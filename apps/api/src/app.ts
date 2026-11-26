import express from "express";
import { AppError } from "./errors/app-error.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.routes.js";
import { userRouter } from "./modules/users/user.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);

  app.use((_request, _response, next) => {
    next(
      new AppError({
        statusCode: 404,
        code: "ROUTE_NOT_FOUND",
        message: "The requested route was not found",
      }),
    );
  });

  app.use(errorHandler);

  return app;
};