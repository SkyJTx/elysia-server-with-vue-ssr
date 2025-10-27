import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { getSrcPath } from "./src/lib/paths"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [vue(), tsConfigPaths()],
  resolve: {
    alias: {
      "@": getSrcPath(),
      "@/views": getSrcPath("views"),
      "@/api": getSrcPath("api"),
      "@/lib": getSrcPath("lib"),
      "@/client": getSrcPath("client"),
    },
  },
  ssr: {
    external: ["elysia"],
  },
  build: {
    rollupOptions: {
      input: "src/client/main.ts",
      output: {
        entryFileNames: "app.js",
        dir: "dist/public",
      },
    },
  },
})
