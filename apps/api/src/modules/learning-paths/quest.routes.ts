import { Router } from "express";
import { Role } from "../../generated/prisma/client.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createQuestController,
  deleteQuestController,
  listQuestsController,
  updateQuestController,
} from "./quest.controller.js";

export const questRouter = Router({
  mergeParams: true,
});

questRouter.get("/", listQuestsController);

questRouter.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  createQuestController,
);

questRouter.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  updateQuestController,
);

questRouter.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  deleteQuestController,
);