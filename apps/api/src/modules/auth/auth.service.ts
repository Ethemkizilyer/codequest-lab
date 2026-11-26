import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginUserInput } from "@codequest/shared";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type { PublicUser } from "../users/user.service.js";

export type LoginResult = {
  user: PublicUser;
  accessToken: string;
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

  const accessToken = jwt.sign(
    {
      sub: user.id,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    },
  };
};

export const getCurrentUser = async (
  userId: string,
): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
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