import { fileURLToPath } from "node:url"
import path from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const projectRoot = path.resolve(__dirname, "../..")

export function fromRoot(...pathSegments: string[]): string {
  return path.join(projectRoot, ...pathSegments)
}

export function getTemplatePath(): string {
  return fromRoot("index.html")
}

export function getPublicPath(...pathSegments: string[]): string {
  return fromRoot("dist/public", ...pathSegments)
}

export function getSrcPath(...pathSegments: string[]): string {
  return fromRoot("src", ...pathSegments)
}
