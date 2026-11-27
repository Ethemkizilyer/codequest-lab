import type { Request, Response } from "express";
import { questIdParamsSchema } from "@codequest/shared";
import { AppError } from "../../errors/app-error.js";
import {
  completeQuest,
  listMyProgress,
} from "./progress.service.js";

export const completeQuestController = async (
  request: Request,
  response: Response,
) => {
  const userId = request.auth?.userId;

  if (userId === undefined) {
    throw new AppError({
      statusCode: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required",
    });
  }

  const { questId } = questIdParamsSchema.parse(
    request.params,
  );

  const result = await completeQuest(userId, questId);

  response.status(200).json({
    data: result,
  });
};

export const listMyProgressController = async (
  request: Request,
  response: Response,
) => {
  const userId = request.auth?.userId;

  if (userId === undefined) {
    throw new AppError({
      statusCode: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required",
    });
  }

  const progress = await listMyProgress(userId);

  response.status(200).json({
    data: progress,
  });
};