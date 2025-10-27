import { createSSRApp } from "vue"
import { renderToString } from "vue/server-renderer"
import { createServer as createViteServer } from "vite"
import type { ViteDevServer } from "vite"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { readFileSync } from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatePath = path.join(__dirname, "../../index.html")
const template = readFileSync(templatePath, "utf-8")

const componentCache: Record<string, any> = {}
let viteServer: ViteDevServer | null = null

/**
 * Initialize Vite server for proper .vue compilation
 */
export async function initViteServer() {
  try {
    const projectRoot = path.resolve(__dirname, "../..")
    const server = await createViteServer({
      root: projectRoot,
      server: { middlewareMode: true },
    })
    console.log("✅ Vite server initialized for SSR")
    viteServer = server
    return server
  } catch (error) {
    console.error("Failed to initialize Vite:", error)
    throw error
  }
}

/**
 * Load a Vue component by name and path with caching
 */
export async function loadComponent(name: string, filepath: string) {
  const cacheKey = name

  if (componentCache[cacheKey]) {
    return componentCache[cacheKey]
  }

  try {
    if (!viteServer) {
      throw new Error("Vite server not initialized")
    }

    const module = await viteServer.ssrLoadModule(filepath)

    componentCache[cacheKey] = module
    return module
  } catch (e) {
    console.error(`Failed to load component ${name}:`, e)
    throw e
  }
}

/**
 * Render a Vue component module to HTML string with props
 */
export async function renderPage(module: any, props: Record<string, any>) {
  try {
    const component = module.default || module

    if (!component) {
      throw new Error(`Module has no default export`)
    }

    // Create SSR app with component and props
    const app = createSSRApp(component, props)
    const html = await renderToString(app)

    const fullHtml = template
      .replace("{{APP_HTML}}", html)
      .replace("{{INITIAL_STATE}}", JSON.stringify(props))

    return fullHtml
  } catch (error) {
    console.error("SSR Error:", error)
    throw error
  }
}
