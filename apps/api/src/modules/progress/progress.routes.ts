import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  completeQuestController,
  listMyProgressController,
} from "./progress.controller.js";

export const progressRouter = Router();

progressRouter.post(
  "/quests/:questId/complete",
  authenticate,
  completeQuestController,
);

progressRouter.get(
  "/me/progress",
  authenticate,
  listMyProgressController,
);