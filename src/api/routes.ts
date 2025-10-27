import { Elysia } from "elysia"

export const apiRoutes = new Elysia({ prefix: "/api" })
  .get("/hello", () => ({
    message: "Hello from Elysia API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }))

  .get("/users", () => ({
    users: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "Admin",
      },
      { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
      {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        role: "User",
      },
      {
        id: 4,
        name: "Diana Prince",
        email: "diana@example.com",
        role: "Moderator",
      },
    ],
    total: 4,
  }))

  .get("/users/:id", ({ params }) => {
    const users: Record<string, any> = {
      "1": {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "Admin",
        created: "2024-01-15",
      },
      "2": {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        role: "User",
        created: "2024-02-20",
      },
      "3": {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        role: "User",
        created: "2024-03-10",
      },
      "4": {
        id: 4,
        name: "Diana Prince",
        email: "diana@example.com",
        role: "Moderator",
        created: "2024-01-05",
      },
    }

    const user = users[params.id]
    if (!user) {
      return { error: "User not found", id: params.id }
    }
    return { user }
  })

  .get("/posts", () => ({
    posts: [
      {
        id: 1,
        title: "Getting Started with Elysia",
        author: "Alice",
        views: 150,
      },
      { id: 2, title: "Vue SSR Best Practices", author: "Bob", views: 89 },
      { id: 3, title: "Full-Stack with Bun", author: "Charlie", views: 234 },
    ],
  }))

  .post("/data", ({ body }) => ({
    received: body,
    timestamp: new Date().toISOString(),
    processed: true,
  }))

  .get("/health", () => ({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }))
