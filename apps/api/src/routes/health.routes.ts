import { Router, type Request, type Response } from "express";
import { healthResponseSchema } from "@codequest/shared";

export const healthRouter = Router();

healthRouter.get("/", (_request: Request, response: Response) => {
  const health = healthResponseSchema.parse({
    status: "ok",
    service: "codequest-api",
  });

  response.status(200).json({ data: health });
});
