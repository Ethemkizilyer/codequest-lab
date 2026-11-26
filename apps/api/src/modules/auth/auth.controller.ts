import type { Request, Response } from "express";
import { loginUserSchema } from "@codequest/shared";
import { loginUser } from "./auth.service.js";

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