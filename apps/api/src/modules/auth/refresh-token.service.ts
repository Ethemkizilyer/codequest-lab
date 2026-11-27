import { createHash, randomBytes } from "node:crypto";
import type { PublicUser } from "../users/user.service.js";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type RefreshTokenResult = {
  token: string;
  expiresAt: Date;
};

export type RotatedRefreshToken = {
  token: string;
  expiresAt: Date;
  user: PublicUser;
};

const hashRefreshToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const createRefreshToken = async (
  userId: string,
): Promise<RefreshTokenResult> => {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashRefreshToken(token);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
  };
};

export const rotateRefreshToken = async (
  currentToken: string,
): Promise<RotatedRefreshToken> => {
  const tokenHash = hashRefreshToken(currentToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      expiresAt: true,
      revokedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  if (storedToken === null) {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN",
      message: "The refresh token is invalid",
    });
  }

  if (storedToken.revokedAt !== null || storedToken.expiresAt <= new Date()) {
    throw new AppError({
      statusCode: 401,
      code: "EXPIRED_REFRESH_TOKEN",
      message: "The refresh token is expired or revoked",
    });
  }

  const nextToken = randomBytes(32).toString("base64url");
  const nextTokenHash = hashRefreshToken(nextToken);
  const nextExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await prisma.$transaction(async (transaction) => {
    await transaction.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await transaction.refreshToken.create({
      data: {
        tokenHash: nextTokenHash,
        userId: storedToken.user.id,
        expiresAt: nextExpiresAt,
      },
    });
  });

  return {
    token: nextToken,
    expiresAt: nextExpiresAt,
    user: storedToken.user,
  };
};

export const revokeRefreshToken = async (
  currentToken: string,
): Promise<void> => {
  const tokenHash = hashRefreshToken(currentToken);

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};
