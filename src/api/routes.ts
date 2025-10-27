import { Elysia } from "elysia"

export const apiRoutes = new Elysia({ prefix: "/api" })
  .get("/hello", () => ({
    message: "Hello from Elysia API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }))