import { initVite } from "@/server/vite"
import { createServer } from "@/server/app"
import { setViteServer } from "@/lib/ssr"

const isProduction = process.env.NODE_ENV === "production"

async function start() {
  if (!isProduction) {
    const vite = await initVite()
    setViteServer(vite)
  }

  const app = createServer()
  app.listen(3000)

  const mode = isProduction ? "🚀 Production" : "⚡ Development"
  console.log(`
╔════════════════════════════════════════════════════╗
║   ${mode} - Elysia + Vue SSR                    ║
╚════════════════════════════════════════════════════╝

✅ Server running at: http://localhost:3000
`)
}

start().catch(console.error)
