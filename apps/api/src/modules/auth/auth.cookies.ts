import { env } from "../../config/env.js";

export const REFRESH_TOKEN_COOKIE = "codequest_refresh_token";

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};