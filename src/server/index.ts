import { Elysia } from "elysia"
import { apiRoutes } from "../api/routes.js"
import { initViteServer, loadComponent, renderPage } from "../lib/ssr.js"

/**
 * Start the server
 */
async function start() {
  // Initialize Vite first
  await initViteServer()

  new Elysia()
    .use(apiRoutes)
    .get("/", async () => {
      const props = {
        data: {
          page: "home",
          title: "Welcome to Elysia + Vue SSR",
          description: "Full-stack app with Elysia backend and Vue components",
          timestamp: new Date().toISOString(),
        },
        path: "/",
      }

      const component = await loadComponent("Home", "src/views/Home.vue")
      const html = await renderPage(component, props)
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      })
    })
    .get("/about", async () => {
      const props = {
        data: {
          page: "about",
          title: "About This Project",
        },
        content:
          "Elysia is a backend framework running on Bun. Vue handles the UI with SSR. Together they create a fast, type-safe full-stack application.",
      }

      const component = await loadComponent("About", "src/views/About.vue")
      const html = await renderPage(component, props)
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      })
    })

    // Users page
    .get("/users", async () => {
      const users = [
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
      ]

      const props = {
        users,
        data: {
          page: "users",
          title: "Users Directory",
          count: users.length,
          timestamp: new Date().toISOString(),
        },
        path: "/users",
      }

      const component = await loadComponent("Users", "src/views/Users.vue")
      const html = await renderPage(component, props)
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      })
    })

    // Catch-all 404
    .all("/*", async ({ request }) => {
      const requestPath = new URL(request.url).pathname
      const props = {
        path: requestPath,
      }

      const component = await loadComponent(
        "NotFound",
        "src/views/NotFound.vue"
      )
      const html = await renderPage(component, props)
      return new Response(html, {
        status: 404,
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      })
    })
    .listen(3000)

  console.log(`
╔════════════════════════════════════════════════════╗
║   🦊 Elysia + Vue SSR with Vite                   ║
╚════════════════════════════════════════════════════╝

✅ Server running at: http://localhost:3000
📡 API Routes:
   - GET  /api/hello
   - GET  /api/users
   - GET  /api/users/:id

🎨 Vue SSR Routes (from .vue files):
   - GET  /          (Home.vue)
   - GET  /about     (About.vue)
   - GET  /users     (Users.vue)

📚 Features:
   ✓ Vue components in .vue files
   ✓ Server-side rendering with Vite
   ✓ Data passed to components
   ✓ Full TypeScript support
   ✓ Elysia controls routing
`)
}

// Start the server
start().catch(console.error)
