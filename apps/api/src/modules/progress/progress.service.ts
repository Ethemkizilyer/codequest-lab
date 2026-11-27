import { QuestProgressStatus } from "../../generated/prisma/client.js";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

export const completeQuest = async (
  userId: string,
  questId: string,
) => {
  return prisma.$transaction(async (transaction) => {
    const quest = await transaction.quest.findUnique({
      where: {
        id: questId,
      },
      select: {
        id: true,
        xp: true,
        learningPath: {
          select: {
            isPublished: true,
          },
        },
      },
    });

    if (
      quest === null ||
      quest.learningPath.isPublished === false
    ) {
      throw new AppError({
        statusCode: 404,
        code: "QUEST_NOT_FOUND",
        message: "Quest was not found",
      });
    }

    const existingProgress =
      await transaction.questProgress.findUnique({
        where: {
          userId_questId: {
            userId,
            questId,
          },
        },
        select: {
          id: true,
          status: true,
          completedAt: true,
          earnedXp: true,
        },
      });

    if (
      existingProgress?.status ===
      QuestProgressStatus.COMPLETED
    ) {
      const user = await transaction.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          totalXp: true,
        },
      });

      if (user === null) {
        throw new AppError({
          statusCode: 404,
          code: "USER_NOT_FOUND",
          message: "User was not found",
        });
      }

      return {
        progress: existingProgress,
        totalXp: user.totalXp,
        alreadyCompleted: true,
      };
    }

    const completedAt = new Date();

    const progress =
      existingProgress === undefined || existingProgress === null
        ? await transaction.questProgress.create({
            data: {
              userId,
              questId,
              status: QuestProgressStatus.COMPLETED,
              completedAt,
              earnedXp: quest.xp,
            },
            select: {
              id: true,
              questId: true,
              status: true,
              completedAt: true,
              earnedXp: true,
            },
          })
        : await transaction.questProgress.update({
            where: {
              id: existingProgress.id,
            },
            data: {
              status: QuestProgressStatus.COMPLETED,
              completedAt,
              earnedXp: quest.xp,
            },
            select: {
              id: true,
              questId: true,
              status: true,
              completedAt: true,
              earnedXp: true,
            },
          });

    const user = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        totalXp: {
          increment: quest.xp,
        },
      },
      select: {
        totalXp: true,
      },
    });

    return {
      progress,
      totalXp: user.totalXp,
      alreadyCompleted: false,
    };
  });
};

export const listMyProgress = async (userId: string) => {
  return prisma.questProgress.findMany({
    where: {
      userId,
    },
    orderBy: {
      completedAt: "desc",
    },
    select: {
      id: true,
      questId: true,
      status: true,
      completedAt: true,
      earnedXp: true,
      quest: {
        select: {
          slug: true,
          title: true,
          difficulty: true,
          learningPath: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      },
    },
  });
};