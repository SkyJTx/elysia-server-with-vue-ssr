import { Elysia } from "elysia"
import { createSSRApp } from "vue"
import { renderToString } from "vue/server-renderer"
import { apiRoutes } from "../api/routes.js"
import { fileURLToPath, URL } from "node:url"
import path from "node:path"
import { readFileSync } from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === "production"
const templatePath = path.join(__dirname, "../../index.html")
const template = readFileSync(templatePath, "utf-8")

const componentCache: Record<string, any> = {}

async function loadComponent(componentName: string) {
  if (componentCache[componentName]) {
    return componentCache[componentName]
  }

  if (!isProduction) {
    try {
      const mod = await import(`../views/${componentName}.vue`)
      componentCache[componentName] = mod.default
      return mod.default
    } catch (e) {
      console.error(`Failed to load component ${componentName}:`, e)
      return null
    }
  }

  return null
}

async function renderPage(componentName: string, props: Record<string, any>) {
  try {
    const component = await loadComponent(componentName)
    if (!component) {
      throw new Error(`Component ${componentName} not found`)
    }

    const componentApp = createSSRApp(component)
    const html = await renderToString(componentApp)

    const fullHtml = template
      .replace("{{APP_HTML}}", html)
      .replace("{{INITIAL_STATE}}", JSON.stringify(props))

    return fullHtml
  } catch (error) {
    console.error("SSR Error:", error)
    throw error
  }
}

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

    const html = await renderPage("Home", props)
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

    const html = await renderPage("About", props)
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

    const html = await renderPage("Users", props)
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

    const html = await renderPage("NotFound", props)
    return new Response(html, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    })
  })

  .listen(3000)

console.log(`
╔════════════════════════════════════════════════════╗
║   🦊 Elysia + Vue SSR with .vue Files             ║
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
