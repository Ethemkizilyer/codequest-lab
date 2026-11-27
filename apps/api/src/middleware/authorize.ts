import type { RequestHandler } from "express";
import { Role } from "../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";

export const authorize = (
  ...allowedRoles: Role[]
): RequestHandler => {
  return async (request, _response, next) => {
    void _response;

    const userId = request.auth?.userId;

    if (userId === undefined) {
      next(
        new AppError({
          statusCode: 401,
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication is required",
        }),
      );

      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (user === null) {
      next(
        new AppError({
          statusCode: 401,
          code: "USER_NOT_FOUND",
          message: "Authenticated user was not found",
        }),
      );

      return;
    }

    if (!allowedRoles.includes(user.role)) {
      next(
        new AppError({
          statusCode: 403,
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        }),
      );

      return;
    }

    next();
  };
};