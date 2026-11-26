import { z } from "zod";
 
const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65_535)
    .default(4000),

  DATABASE_URL: z.string().url(),
});
 
export const env = environmentSchema.parse(process.env);
 
export type Environment = z.infer<typeof environmentSchema>;