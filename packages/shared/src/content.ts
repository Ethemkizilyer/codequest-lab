import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers and hyphens only",
  );

export const createLearningPathSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(500),
  isPublished: z.boolean().default(false),
});

export const updateLearningPathSchema =
  createLearningPathSchema.partial();

export const learningPathSlugParamsSchema = z.object({
  slug: slugSchema,
});

export type CreateLearningPathInput = z.infer<
  typeof createLearningPathSchema
>;

export type UpdateLearningPathInput = z.infer<
  typeof updateLearningPathSchema
>;

export const difficultySchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
]);

export const createQuestSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(10).max(300),
  content: z.string().trim().min(20),
  difficulty: difficultySchema,
  order: z.coerce.number().int().min(1).max(1000),
  xp: z.coerce.number().int().min(1).max(10_000).default(100),
});

export const updateQuestSchema = createQuestSchema.partial();

export const learningPathIdParamsSchema = z.object({
  id: z.string().cuid(),
});
 
export const questLearningPathIdParamsSchema = z.object({
  learningPathId: z.string().cuid(),
});
 
export const questParamsSchema = z.object({
  learningPathId: z.string().cuid(),
  id: z.string().cuid(),
});
export type CreateQuestInput = z.infer<
  typeof createQuestSchema
>;

export type UpdateQuestInput = z.infer<
  typeof updateQuestSchema
>;

export const questIdParamsSchema = z.object({
  questId: z.string().cuid(),
});