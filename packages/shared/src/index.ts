import { z } from "zod";
export {
  createLearningPathSchema,
  updateLearningPathSchema,
  learningPathSlugParamsSchema,
  learningPathIdParamsSchema,
  type CreateLearningPathInput,
  type UpdateLearningPathInput,
} from "./content.js";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("codequest-api"),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export {
  registerUserSchema,
  loginUserSchema,
  type LoginUserInput,
  type RegisterUserInput,
} from "./auth.js";
