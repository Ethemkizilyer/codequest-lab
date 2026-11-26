import type { Request, Response } from "express";
import { loginUserSchema } from "@codequest/shared";
import {
  getCurrentUser,
  loginUser,
} from "./auth.service.js";

export const loginUserController = async (
  request: Request,
  response: Response,
) => {
  const input = loginUserSchema.parse(request.body);
  const result = await loginUser(input);

  response.status(200).json({
    data: result,
  });
};

export const getCurrentUserController = async (
  request: Request,
  response: Response,
) => {
  const userId = request.auth?.userId;

  if (userId === undefined) {
    response.status(401).json({
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      },
    });

    return;
  }

  const user = await getCurrentUser(userId);

  response.status(200).json({
    data: user,
  });
};