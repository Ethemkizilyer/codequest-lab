import type {
  CreateQuestInput,
  UpdateQuestInput,
} from "@codequest/shared";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

const questSelect = {
  id: true,
  learningPathId: true,
  slug: true,
  title: true,
  summary: true,
  content: true,
  difficulty: true,
  order: true,
  xp: true,
  createdAt: true,
  updatedAt: true,
} as const;

const ensureLearningPathExists = async (
  learningPathId: string,
) => {
  const learningPath = await prisma.learningPath.findUnique({
    where: {
      id: learningPathId,
    },
    select: {
      id: true,
      isPublished: true,
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

const ensureQuestBelongsToPath = async (
  learningPathId: string,
  questId: string,
) => {
  const quest = await prisma.quest.findFirst({
    where: {
      id: questId,
      learningPathId,
    },
    select: {
      id: true,
    },
  });

  if (quest === null) {
    throw new AppError({
      statusCode: 404,
      code: "QUEST_NOT_FOUND",
      message: "Quest was not found",
    });
  }
};

export const listPublishedQuests = async (
  learningPathId: string,
) => {
  const learningPath =
    await ensureLearningPathExists(learningPathId);

  if (!learningPath.isPublished) {
    throw new AppError({
      statusCode: 404,
      code: "LEARNING_PATH_NOT_FOUND",
      message: "Learning path was not found",
    });
  }

  return prisma.quest.findMany({
    where: {
      learningPathId,
    },
    select: questSelect,
    orderBy: {
      order: "asc",
    },
  });
};

export const createQuest = async (
  learningPathId: string,
  input: CreateQuestInput,
) => {
  await ensureLearningPathExists(learningPathId);

  return prisma.quest.create({
    data: {
      ...input,
      learningPathId,
    },
    select: questSelect,
  });
};

export const updateQuest = async (
  learningPathId: string,
  questId: string,
  input: UpdateQuestInput,
) => {
  await ensureQuestBelongsToPath(learningPathId, questId);

  const updateData = {
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.summary !== undefined
      ? { summary: input.summary }
      : {}),
    ...(input.content !== undefined
      ? { content: input.content }
      : {}),
    ...(input.difficulty !== undefined
      ? { difficulty: input.difficulty }
      : {}),
    ...(input.order !== undefined
      ? { order: input.order }
      : {}),
    ...(input.xp !== undefined ? { xp: input.xp } : {}),
  };

  return prisma.quest.update({
    where: {
      id: questId,
    },
    data: updateData,
    select: questSelect,
  });
};

export const deleteQuest = async (
  learningPathId: string,
  questId: string,
): Promise<void> => {
  await ensureQuestBelongsToPath(learningPathId, questId);

  await prisma.quest.delete({
    where: {
      id: questId,
    },
  });
};