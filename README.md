# Elysia + Vue SSR

Full-stack framework: **Elysia** (Bun backend) + **Vue 3** (SSR). Elysia controls all routing and renders Vue components server-side.

## ⚡ Quick Start

```bash
bun install
bun run dev          # http://localhost:3000
bun run build        # Production build
bun run preview      # Test production locally
```

## 📁 Structure

`
src/
  server/index.ts    → Routes & SSR
  api/routes.ts      → JSON endpoints
  views/
    *.vue            → Page components
index.html           → HTML template
`

## 🏗️ How It Works

1. Request → Elysia server
2. Fetch data from DB/API
3. Load Vue component
4. Render to HTML + inject data as `window.__INITIAL_STATE__`
5. Return full HTML page

---

## 🛣️ Add a Page Route

**src/server/index.ts:**

```typescript
.get('/my-page', async () => {
  const props = { title: 'My Page', data: [...] }
  const html = await renderPage('MyComponent', props)
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  })
})
```

**src/views/MyComponent.vue:**

```vue
<script setup lang="ts">
interface Props {
  title: string
  data: any[]
}
defineProps<Props>()
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <div v-for="item in data" :key="item.id">{{ item.name }}</div>
  </div>
</template>

<style scoped>
h1 { color: #333; }
</style>
```

## 📡 Add an API Endpoint

**src/api/routes.ts:**

```typescript
.post("/submit", ({ body }) => {
  const data = body as { name: string }
  return { success: true, message: `Hello ${data.name}` }
})

.get("/items/:id", ({ params }) => {
  return { id: params.id, name: "Item" }
})
```

## 🎨 Vue Component Pattern

```vue
<script setup lang="ts">
interface Item {
  id: number
  name: string
}

interface Props {
  items: Item[]
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<style scoped>
.container { max-width: 1000px; margin: 0 auto; padding: 20px; }
h1 { color: #333; margin-bottom: 20px; }
</style>
```

## 🌐 Browser APIs (SSR Safe)

### ✅ Pattern 1: Use `onMounted`

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const count = ref(0)

onMounted(() => {
  // Runs ONLY in browser, never on server
  const saved = localStorage.getItem('count')
  if (saved) count.value = parseInt(saved)
})

const save = () => {
  localStorage.setItem('count', count.value.toString())
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="save">Save</button>
  </div>
</template>
```

### ✅ Pattern 2: Guard with `typeof`

```typescript
// In utilities, check if running in browser
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme') || 'light'
  document.body.className = theme
}
```

### Common Browser APIs

| API | Safe Pattern |
|-----|-------------|
| `localStorage` | Use in `onMounted()` |
| `fetch` | Use in `onMounted()` |
| `document` | Use in `onMounted()` |
| `window` | Guard with `typeof window !== 'undefined'` |
| `navigator.geolocation` | Use in `onMounted()` |
| `IntersectionObserver` | Use in `onMounted()` |

## 🚀 Build & Deploy

### Development

```bash
bun run dev
# Auto-reloads on file changes
```

### Production Build

```bash
bun run build
# Creates dist/server.js
```

### Deploy Options

#### Railway (Recommended)

- Push to GitHub
- Connect at railway.app
- Auto-deploys on push

#### Docker

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install && bun run build
CMD ["node", "dist/server.js"]
```

#### VPS (DigitalOcean, AWS, etc.)

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Build
git clone <your-repo>
cd <your-repo>
bun install && bun run build

# Run with PM2
bun add -g pm2
pm2 start dist/server.js
pm2 startup
pm2 save
```

## 📦 Import Aliases

Use `@/` shortcuts:

```typescript
import Home from '@/views/Home.vue'
import { apiRoutes } from '@/api/routes.ts'
import type { User } from '@/types.ts'

// Aliases defined in tsconfig.json
// @/*        → src/*
// @/views/*  → src/views/*
// @/api/*    → src/api/*
// @/server/* → src/server/*
```

## 🐛 Troubleshooting

**Port in use:**
Change in `src/server/index.ts`: `.listen(3001)`

**Component not found:**

- Check file exists in `src/views/`
- Check name matches exactly (case-sensitive)
- Run `bun install`

**TypeScript errors:**

```bash
rm -r node_modules && bun install
```

**Build fails:**

```bash
# Ensure Bun is installed
curl -fsSL https://bun.sh/install | bash
```

## 📚 Dependencies

- **elysia** - HTTP framework for Bun
- **vue** - UI framework
- **typescript** - Type safety
- **bun-types** - TypeScript types for Bun

## 🎯 Key Features

✅ Elysia controls all routing (no Vue Router)  
✅ Server-side rendering (faster, better SEO)  
✅ TypeScript throughout (full type safety)  
✅ Hot reload development (`bun run dev`)  
✅ Lightning fast (Bun runtime)  
✅ Single bundled production file  
✅ Browser API safe patterns included  

## 🚀 Next Steps

1. **Add a page:** Create `.vue` file in `src/views/`
2. **Add route:** Add `.get()` in `src/server/index.ts`
3. **Add API:** Add endpoint in `src/api/routes.ts`
4. **Connect DB:** Use your database driver
5. **Deploy:** Push to GitHub, deploy to Railway/Docker/VPS

---

**Start:** `bun run dev`  
**Build:** `bun run build`  
**Deploy:** `bun run preview` then push production build
