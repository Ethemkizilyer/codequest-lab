import { Router } from "express";
import { Role } from "../../generated/prisma/client.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createLearningPathController,
  deleteLearningPathController,
  getLearningPathController,
  listLearningPathsController,
  updateLearningPathController,
} from "./learning-path.controller.js";

export const learningPathRouter = Router();

learningPathRouter.get(
  "/",
  listLearningPathsController,
);

learningPathRouter.get(
  "/:slug",
  getLearningPathController,
);

learningPathRouter.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  createLearningPathController,
);

learningPathRouter.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  updateLearningPathController,
);

learningPathRouter.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  deleteLearningPathController,
);