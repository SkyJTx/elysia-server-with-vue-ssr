import { createSSRApp } from "vue"

const componentModules = (import.meta as any).glob("@/**/*.vue", {
  eager: true,
})

const components: Record<string, any> = {}
for (const [path, module] of Object.entries(componentModules)) {
  const name = path.split("/").pop()?.replace(".vue", "") || ""
  components[name] = (module as any).default
}

const initialState = (window as any).__INITIAL_STATE__ || {}
const componentName = (window as any).__COMPONENT_NAME__ || "Home"

const component = components[componentName]

if (!component) {
  console.error(
    `Component ${componentName} not found. Available: ${Object.keys(
      components
    ).join(", ")}`
  )
} else {
  const app = createSSRApp(component, initialState)
  app.mount("#app")
}
