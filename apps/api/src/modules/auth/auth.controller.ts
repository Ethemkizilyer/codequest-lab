import type { Request, Response } from "express";
import { loginUserSchema } from "@codequest/shared";
import {
  getCurrentUser,
  loginUser,
} from "./auth.service.js";
import {
  REFRESH_TOKEN_COOKIE,
  refreshTokenCookieOptions,
} from "./auth.cookies.js";
import { AppError } from "../../errors/app-error.js";
import { createAccessToken } from "./auth.tokens.js";
import {
  revokeRefreshToken,
  rotateRefreshToken,
} from "./refresh-token.service.js";

export const loginUserController = async (
  request: Request,
  response: Response,
) => {
  const input = loginUserSchema.parse(request.body);
  const result = await loginUser(input);

  response.cookie(
    REFRESH_TOKEN_COOKIE,
    result.refreshToken.token,
    refreshTokenCookieOptions,
  );

  response.status(200).json({
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
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

export const refreshAccessTokenController = async (
  request: Request,
  response: Response,
) => {
  const currentToken = request.cookies?.[REFRESH_TOKEN_COOKIE];

  if (typeof currentToken !== "string" || currentToken.length === 0) {
    throw new AppError({
      statusCode: 401,
      code: "REFRESH_TOKEN_REQUIRED",
      message: "A refresh token is required",
    });
  }

  const result = await rotateRefreshToken(currentToken);
  const accessToken = createAccessToken(result.user.id);

  response.cookie(
    REFRESH_TOKEN_COOKIE,
    result.token,
    refreshTokenCookieOptions,
  );

  response.status(200).json({
    data: {
      accessToken,
      user: result.user,
    },
  });
};

export const logoutController = async (
  request: Request,
  response: Response,
) => {
  const currentToken = request.cookies?.[REFRESH_TOKEN_COOKIE];

  if (typeof currentToken === "string" && currentToken.length > 0) {
    await revokeRefreshToken(currentToken);
  }

  response.clearCookie(
    REFRESH_TOKEN_COOKIE,
    refreshTokenCookieOptions,
  );

  response.status(204).send();
};