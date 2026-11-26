import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),

  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_ACCESS_EXPIRES_IN: z.enum(["15m", "30m", "1h"]).default("15m"),
});

export const env = environmentSchema.parse(process.env);

export type Environment = z.infer<typeof environmentSchema>;
