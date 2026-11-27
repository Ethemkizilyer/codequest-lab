import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const createAccessToken = (userId: string): string => {
  return jwt.sign(
    {
      sub: userId,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );
};