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

export const learningPathIdParamsSchema = z.object({
  id: z.string().cuid(),
});

export type CreateLearningPathInput = z.infer<
  typeof createLearningPathSchema
>;

export type UpdateLearningPathInput = z.infer<
  typeof updateLearningPathSchema
>;