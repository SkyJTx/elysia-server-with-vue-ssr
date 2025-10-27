import { Elysia } from "elysia"
import { apiRoutes } from "@/api/routes"
import { serveAppJs, serveAsset } from "@/lib/static"
import { setupViteMiddleware } from "./middleware"
import { createHomeRoute, createNotFoundRoute } from "./routes"

export function createServer() {
  const app = new Elysia()
    .use(apiRoutes)
    .get("/app.js", () => serveAppJs())
    .get("/assets/*", ({ params }) => serveAsset(params["*"]))

  setupViteMiddleware(app)

  return app.get("/", createHomeRoute()).all("/*", createNotFoundRoute())
}
