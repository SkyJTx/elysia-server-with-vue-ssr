import { createSSRApp } from "vue"
import { renderToString } from "vue/server-renderer"
import type { ViteDevServer } from "vite"
import { readFileSync, readdirSync, existsSync } from "fs"
import { getTemplatePath, getPublicPath } from "./paths"

const template = readFileSync(getTemplatePath(), "utf-8")
const componentCache: Record<string, any> = {}
const isProduction = process.env.NODE_ENV === "production"

let viteServer: ViteDevServer | null = null

function findCssFile(): string | null {
  try {
    const assetsPath = getPublicPath("assets")
    if (!existsSync(assetsPath)) return null
    const files = readdirSync(assetsPath)
    const cssFile = files.find((f) => f.endsWith(".css"))
    return cssFile ? `/assets/${cssFile}` : null
  } catch {
    return null
  }
}

export function setViteServer(server: ViteDevServer | null) {
  viteServer = server
}

export async function loadComponent(name: string, filepath: string) {
  const cacheKey = filepath

  if (!isProduction && componentCache[cacheKey]) {
    delete componentCache[cacheKey]
  }

  if (isProduction && componentCache[cacheKey]) {
    return componentCache[cacheKey]
  }

  try {
    let module: any

    if (isProduction) {
      module = await import(filepath)
    } else {
      if (!viteServer) {
        throw new Error("Vite server not initialized")
      }
      module = await viteServer.ssrLoadModule(filepath)
    }

    if (isProduction) {
      componentCache[cacheKey] = module
    }
    return module
  } catch (e) {
    console.error(`Failed to load component ${name}:`, e)
    throw e
  }
}

export async function renderPage(
  componentName: string,
  module: any,
  props: Record<string, any>
) {
  try {
    const component = module.default || module

    if (!component) {
      throw new Error(`Module has no default export`)
    }

    const app = createSSRApp(component, props)
    const html = await renderToString(app)

    const cssFile = findCssFile()
    const cssHash = cssFile
      ? cssFile.split("main-")[1]?.split(".css")[0] || ""
      : ""

    const devScripts = !isProduction
      ? `<script type="module" src="/@vite/client"></script>`
      : ""

    return template
      .replace("{{APP_HTML}}", html)
      .replace("{{INITIAL_STATE}}", JSON.stringify(props))
      .replace("{{COMPONENT_NAME}}", componentName)
      .replace("{{CSS_HASH}}", cssHash)
      .replace("{{DEV_SCRIPTS}}", devScripts)
  } catch (error) {
    console.error("SSR Error:", error)
    throw error
  }
}
