import type { Request, Response } from "express";
import { registerUserSchema } from "@codequest/shared";
import { createUser } from "./user.service.js";

export const registerUserController = async (
  request: Request,
  response: Response,
) => {
  const input = registerUserSchema.parse(request.body);
  const user = await createUser(input);

  response.status(201).json({
    data: user,
  });
};