import { createServer as createViteServer } from "vite"
import type { ViteDevServer } from "vite"
import { projectRoot } from "@/lib/paths"

let viteInstance: ViteDevServer | null = null

export async function initVite(): Promise<ViteDevServer | null> {
  if (process.env.NODE_ENV === "production") {
    return null
  }

  try {
    viteInstance = await createViteServer({
      root: projectRoot,
      server: {
        middlewareMode: true,
      },
    })
    console.log("✅ Vite dev server initialized for SSR")
    return viteInstance
  } catch (error) {
    console.error("Failed to initialize Vite:", error)
    throw error
  }
}

export function getViteInstance(): ViteDevServer | null {
  return viteInstance
}
