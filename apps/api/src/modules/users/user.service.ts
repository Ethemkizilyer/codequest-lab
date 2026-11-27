import bcrypt from "bcryptjs";
import type { RegisterUserInput } from "@codequest/shared";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { Role } from "../../generated/prisma/client.js";

export type PublicUser = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: Date;
};

export const createUser = async (
  input: RegisterUserInput,
): Promise<PublicUser> => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser !== null) {
    throw new AppError({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
      message: "A user with this email already exists",
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    },
    select: {
      id: true,
      email: true,
      role: true,
      displayName: true,
      createdAt: true,
    },
  });
};