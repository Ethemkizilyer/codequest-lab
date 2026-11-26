import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),

  password: z
    .string()
    .min(8)
    .max(72),

  displayName: z
    .string()
    .trim()
    .min(2)
    .max(50),
});

export const loginUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
 
  password: z
    .string()
    .min(1)
    .max(72),
});
 
export type LoginUserInput = z.infer<typeof loginUserSchema>;

export type RegisterUserInput = z.infer<typeof registerUserSchema>;