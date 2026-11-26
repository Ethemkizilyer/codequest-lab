import { Router } from "express";
import { registerUserController } from "./user.controller.js";

export const userRouter = Router();

userRouter.post("/", registerUserController);