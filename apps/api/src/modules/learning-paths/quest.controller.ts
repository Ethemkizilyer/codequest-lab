import type { Request, Response } from "express";
import {
  createQuestSchema,
  questLearningPathIdParamsSchema,
  questParamsSchema,
  updateQuestSchema,
} from "@codequest/shared";
import {
  createQuest,
  deleteQuest,
  listPublishedQuests,
  updateQuest,
} from "./quest.service.js";

export const listQuestsController = async (
  request: Request,
  response: Response,
) => {
  const { learningPathId } =
    questLearningPathIdParamsSchema.parse(request.params);

  const quests = await listPublishedQuests(learningPathId);

  response.status(200).json({
    data: quests,
  });
};

export const createQuestController = async (
  request: Request,
  response: Response,
) => {
  const { learningPathId } =
    questLearningPathIdParamsSchema.parse(request.params);

  const input = createQuestSchema.parse(request.body);
  const quest = await createQuest(learningPathId, input);

  response.status(201).json({
    data: quest,
  });
};

export const updateQuestController = async (
  request: Request,
  response: Response,
) => {
  const { learningPathId, id } =
    questParamsSchema.parse(request.params);

  const input = updateQuestSchema.parse(request.body);
  const quest = await updateQuest(learningPathId, id, input);

  response.status(200).json({
    data: quest,
  });
};

export const deleteQuestController = async (
  request: Request,
  response: Response,
) => {
  const { learningPathId, id } =
    questParamsSchema.parse(request.params);

  await deleteQuest(learningPathId, id);

  response.status(204).send();
};