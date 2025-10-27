import { loadComponent, renderPage } from "@/lib/ssr"

export function createHomeRoute() {
  return async () => {
    const props = {
      data: {
        page: "home",
        title: "Welcome to Elysia + Vue SSR",
        description: "Full-stack app with Elysia backend and Vue components",
        timestamp: new Date().toISOString(),
      },
      path: "/",
    }

    const component = await loadComponent("Home", "@/views/Home.vue")
    const html = await renderPage("Home", component, props)
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    })
  }
}

export function createNotFoundRoute() {
  return async ({ request }: { request: Request }) => {
    const requestPath = new URL(request.url).pathname
    const props = {
      path: requestPath,
    }

    const component = await loadComponent("NotFound", "@/views/NotFound.vue")
    const html = await renderPage("NotFound", component, props)
    return new Response(html, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    })
  }
}
