import bcrypt from "bcryptjs";
import { createAccessToken } from "./auth.tokens.js";
import {
  createRefreshToken,
  type RefreshTokenResult,
} from "./refresh-token.service.js";
import type { LoginUserInput } from "@codequest/shared";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type { PublicUser } from "../users/user.service.js";

export type LoginResult = {
  user: PublicUser;
  accessToken: string;
  refreshToken: RefreshTokenResult;
};

export const loginUser = async (
  input: LoginUserInput,
): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      passwordHash: true,
      createdAt: true,
    },
  });

  if (user === null) {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  }

  const accessToken = createAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

export const getCurrentUser = async (userId: string): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      createdAt: true,
    },
  });

  if (user === null) {
    throw new AppError({
      statusCode: 404,
      code: "USER_NOT_FOUND",
      message: "User was not found",
    });
  }

  return user;
};
