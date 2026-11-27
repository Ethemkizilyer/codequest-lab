import type { Request, Response } from "express";
import {
  createLearningPathSchema,
  learningPathIdParamsSchema,
  learningPathSlugParamsSchema,
  updateLearningPathSchema,
} from "@codequest/shared";
import {
  createLearningPath,
  deleteLearningPath,
  getPublishedLearningPathBySlug,
  listPublishedLearningPaths,
  updateLearningPath,
} from "./learning-path.service.js";

export const listLearningPathsController = async (
  _request: Request,
  response: Response,
) => {
  const learningPaths = await listPublishedLearningPaths();

  response.status(200).json({
    data: learningPaths,
  });
};

export const getLearningPathController = async (
  request: Request,
  response: Response,
) => {
  const { slug } = learningPathSlugParamsSchema.parse(
    request.params,
  );

  const learningPath =
    await getPublishedLearningPathBySlug(slug);

  response.status(200).json({
    data: learningPath,
  });
};

export const createLearningPathController = async (
  request: Request,
  response: Response,
) => {
  const input = createLearningPathSchema.parse(request.body);
  const learningPath = await createLearningPath(input);

  response.status(201).json({
    data: learningPath,
  });
};

export const updateLearningPathController = async (
  request: Request,
  response: Response,
) => {
  const { id } = learningPathIdParamsSchema.parse(request.params);
  const input = updateLearningPathSchema.parse(request.body);

  const learningPath = await updateLearningPath(id, input);

  response.status(200).json({
    data: learningPath,
  });
};

export const deleteLearningPathController = async (
  request: Request,
  response: Response,
) => {
  const { id } = learningPathIdParamsSchema.parse(request.params);

  await deleteLearningPath(id);

  response.status(204).send();
};