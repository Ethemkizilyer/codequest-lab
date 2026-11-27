import { Router } from "express";
import {
  getCurrentUserController,
  loginUserController,
  logoutController,
  refreshAccessTokenController,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export const authRouter = Router();

authRouter.post("/login", loginUserController);

authRouter.post(
  "/refresh",
  refreshAccessTokenController,
);

authRouter.post("/logout", logoutController);

authRouter.get(
  "/me",
  authenticate,
  getCurrentUserController,
);