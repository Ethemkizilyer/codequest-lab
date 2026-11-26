import { Router } from "express";
import {
  getCurrentUserController,
  loginUserController,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export const authRouter = Router();

authRouter.post("/login", loginUserController);

authRouter.get(
  "/me",
  authenticate,
  getCurrentUserController,
);