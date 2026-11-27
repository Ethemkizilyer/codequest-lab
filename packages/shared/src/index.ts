import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("codequest-api"),
});

export type HealthResponse = z.infer<
  typeof healthResponseSchema
>;

export {
  registerUserSchema,
  loginUserSchema,
  type LoginUserInput,
  type RegisterUserInput,
} from "./auth.js";

export {
  createLearningPathSchema,
  updateLearningPathSchema,
  learningPathSlugParamsSchema,
  learningPathIdParamsSchema,
  questLearningPathIdParamsSchema,
  questParamsSchema,
  difficultySchema,
  createQuestSchema,
  updateQuestSchema,
  questIdParamsSchema,
  type CreateLearningPathInput,
  type UpdateLearningPathInput,
  type CreateQuestInput,
  type UpdateQuestInput,
} from "./content.js";