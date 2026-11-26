import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("codequest-api"),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export {
  registerUserSchema,
  type RegisterUserInput,
} from "./auth.js";