import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("GET /api/v1/health", () => {
  it("returns the API health status", async () => {
    const response = await request(createApp()).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        status: "ok",
        service: "codequest-api",
      },
    });
  });
});

describe("Unknown routes", () => {
  it("returns a standard not found error", async () => {
    const response = await request(createApp()).get(
      "/api/v1/does-not-exist",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "The requested route was not found",
      },
    });
  });
});