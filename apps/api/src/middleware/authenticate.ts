import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

export const authenticate: RequestHandler = (
  request,
  _response,
  next,
) => {
  void _response;

  const authorizationHeader = request.header("authorization");

  if (authorizationHeader === undefined) {
    next(
      new AppError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      }),
    );

    return;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || token === undefined || token.length === 0) {
    next(
      new AppError({
        statusCode: 401,
        code: "INVALID_AUTHORIZATION_HEADER",
        message: "Authorization header must use the Bearer scheme",
      }),
    );

    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string"
    ) {
      next(
        new AppError({
          statusCode: 401,
          code: "INVALID_ACCESS_TOKEN",
          message: "The access token is invalid",
        }),
      );

      return;
    }

    request.auth = {
      userId: payload.sub,
    };

    next();
  } catch {
    next(
      new AppError({
        statusCode: 401,
        code: "INVALID_ACCESS_TOKEN",
        message: "The access token is invalid or expired",
      }),
    );
  }
};