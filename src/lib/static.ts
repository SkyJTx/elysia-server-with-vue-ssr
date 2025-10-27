import { getPublicPath } from "./paths"

export async function serveAppJs() {
  try {
    const filePath = getPublicPath("app.js")
    const file = await Bun.file(filePath).text()
    return new Response(file, {
      headers: { "Content-Type": "application/javascript" },
    })
  } catch (e) {
    console.error("Error serving app.js:", e)
    return new Response("Not found", { status: 404 })
  }
}

export async function serveAsset(assetPath: string) {
  try {
    const filePath = getPublicPath("assets", assetPath)
    const file = Bun.file(filePath)
    const contentType = filePath.endsWith(".css")
      ? "text/css"
      : "application/javascript"
    return new Response(file, {
      headers: { "Content-Type": contentType },
    })
  } catch (e) {
    console.error("Error serving asset:", e)
    return new Response("Not found", { status: 404 })
  }
}
