import type { Elysia } from "elysia"

export function setupViteMiddleware(app: Elysia) {
  const isProduction = process.env.NODE_ENV === "production"
  if (isProduction) return app

  return app.all("/@*", async ({ request }) => {
    const url = new URL(request.url)
    const viteUrl = `http://localhost:5173${url.pathname}${url.search}`

    try {
      const options: RequestInit = {
        method: request.method,
        headers: request.headers,
      }

      if (request.method !== "GET" && request.method !== "HEAD") {
        options.body = await request.blob()
      }

      const response = await fetch(viteUrl, options)

      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      })
    } catch {
      return new Response("Vite dev server not available", { status: 502 })
    }
  })
}
