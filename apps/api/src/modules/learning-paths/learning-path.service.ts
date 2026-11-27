import type {
  CreateLearningPathInput,
  UpdateLearningPathInput,
} from "@codequest/shared";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

const learningPathSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const listPublishedLearningPaths = async () => {
  return prisma.learningPath.findMany({
    where: {
      isPublished: true,
    },
    select: learningPathSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPublishedLearningPathBySlug = async (slug: string) => {
  const learningPath = await prisma.learningPath.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      ...learningPathSelect,
      quests: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          difficulty: true,
          order: true,
          xp: true,
        },
      },
    },
  });

  if (learningPath === null) {
    throw new AppError({
      statusCode: 404,
      code: "LEARNING_PATH_NOT_FOUND",
      message: "Learning path was not found",
    });
  }

  return learningPath;
};

export const createLearningPath = async (input: CreateLearningPathInput) => {
  return prisma.learningPath.create({
    data: input,
    select: learningPathSelect,
  });
};

export const updateLearningPath = async (
  id: string,
  input: UpdateLearningPathInput,
) => {
  const existingPath = await prisma.learningPath.findUnique({
    where: { id },
    select: { id: true },
  });

  if (existingPath === null) {
    throw new AppError({
      statusCode: 404,
      code: "LEARNING_PATH_NOT_FOUND",
      message: "Learning path was not found",
    });
  }

  const updateData = {
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined
      ? { description: input.description }
      : {}),
    ...(input.isPublished !== undefined
      ? { isPublished: input.isPublished }
      : {}),
  };

  return prisma.learningPath.update({
    where: { id },
    data: updateData,
    select: learningPathSelect,
  });
};

export const deleteLearningPath = async (id: string): Promise<void> => {
  const existingPath = await prisma.learningPath.findUnique({
    where: { id },
    select: { id: true },
  });

  if (existingPath === null) {
    throw new AppError({
      statusCode: 404,
      code: "LEARNING_PATH_NOT_FOUND",
      message: "Learning path was not found",
    });
  }

  await prisma.learningPath.delete({
    where: { id },
  });
};
