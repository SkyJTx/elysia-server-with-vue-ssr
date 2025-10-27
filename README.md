# Elysia + Vue SSR

A full-stack web application framework combining **Elysia** (backend API framework on Bun) with **Vue 3** Server-Side Rendering. Elysia controls all routing and serves both API endpoints and rendered Vue components.

## 📖 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Creating Vue Components](#-creating-vue-components)
- [API Development](#-api-development)
- [Development](#-development)
- [Browser APIs with SSR](#-browser-apis-with-ssr)
- [Build & Deployment](#-build--deployment)
- [Examples](#-common-examples)
- [Troubleshooting](#-troubleshooting)

---

## �🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (runtime and package manager)
- Node.js 18+ (for TypeScript)

### Installation

```bash
cd server-with-vue-ssr
bun install
bun run server
```

Visit `http://localhost:3000` to see the application.

---

## ✅ Current Status

**Server is running on `http://localhost:3000`**

### Test These URLs

```bash
# Frontend Pages (SSR HTML)
http://localhost:3000/          # Home page
http://localhost:3000/about     # About page
http://localhost:3000/users     # Users directory

# Backend API (JSON Endpoints)
http://localhost:3000/api/hello      # Hello message
http://localhost:3000/api/users      # All users list
http://localhost:3000/api/users/1    # Single user
http://localhost:3000/api/health     # Server health
```

---

## 📁 Project Structure

```
src/
├── server/
│   └── index.ts              # Main Elysia server with SSR routes
├── api/
│   └── routes.ts             # API endpoints
└── views/
    ├── Home.vue             # Home page component
    ├── About.vue            # About page component
    ├── Users.vue            # Users directory component
    └── NotFound.vue         # 404 error page component

index.html                   # HTML template for SSR
package.json                 # Dependencies and scripts
vite.config.ts              # Vite configuration
tsconfig.json               # TypeScript configuration
```

---

## 🏗️ Architecture

### Core Concept

- **Elysia controls routing** - All page and API routes are defined in Elysia
- **Vue components render server-side** - `.vue` files are rendered to HTML on the server
- **Data flows from Elysia to Vue** - Component props are passed from Elysia routes
- **Client hydration ready** - Initial state injected via `window.__INITIAL_STATE__`

### Data Flow

```
User Request → Elysia Route → Fetch Data → Load Vue Component →
Render to HTML (renderToString) → Inject window.__INITIAL_STATE__ →
Return HTML Response
```

---

## 🛣️ Defining Routes

### Page Routes (SSR)

Edit `src/server/index.ts` to add new page routes:

```typescript
.get('/my-page', async () => {
  const props = {
    data: {
      title: 'My Page',
      description: 'Page description'
    },
    timestamp: new Date().toISOString()
  }

  const html = await renderPage('MyComponent', props)
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  })
})
```

### API Routes

Edit `src/api/routes.ts` to add new API endpoints:

```typescript
export const apiRoutes = new Elysia({ prefix: "/api" })
  .get("/my-endpoint", () => {
    return {
      message: "Hello from API",
      data: {
        /* your data */
      },
    }
  })
  .post("/submit", ({ body }) => {
    return { success: true }
  })
  .get("/users/:id", ({ params }) => {
    return { id: params.id, name: "User Name" }
  })
```

---

## 🎨 Creating Vue Components

Create `.vue` files in `src/views/`:

### Basic Component Example

**src/views/MyComponent.vue**

```vue
<script setup lang="ts">
interface Props {
  data: Record<string, any>
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <div class="content">
      <p>{{ data.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.content {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
}
</style>
```

### Component with Data Display

**src/views/DataDisplay.vue**

```vue
<script setup lang="ts">
interface Item {
  id: number
  name: string
  value: string
}

interface Props {
  items: Item[]
  title: string
}

defineProps<Props>()
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <ul class="item-list">
      <li v-for="item in items" :key="item.id" class="item">
        <strong>{{ item.name }}</strong
        >: {{ item.value }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.item-list {
  list-style: none;
  padding: 0;
}

.item {
  padding: 10px;
  margin: 5px 0;
  background: #f9f9f9;
  border-left: 3px solid #0066cc;
  border-radius: 3px;
}
</style>
```

---

## 📡 API Development

### Current API Endpoints

```
GET  /api/hello         - Test endpoint with message
GET  /api/users         - Get list of all users
GET  /api/users/:id     - Get single user by ID
GET  /api/posts         - Get posts data
POST /api/data          - Echo endpoint with timestamp
GET  /api/health        - Server health status
```

### Adding API Endpoints

**src/api/routes.ts**

```typescript
export const apiRoutes = new Elysia({ prefix: "/api" })
  .get("/products", () => {
    return [
      { id: 1, name: "Product 1", price: 99.99 },
      { id: 2, name: "Product 2", price: 149.99 },
    ]
  })

  .post("/products", ({ body }) => {
    const { name, price } = body as { name: string; price: number }
    return {
      success: true,
      product: { id: 3, name, price },
    }
  })

  .put("/products/:id", ({ params, body }) => {
    const productId = params.id
    const updates = body as Record<string, any>
    return {
      success: true,
      message: `Updated product ${productId}`,
    }
  })

  .delete("/products/:id", ({ params }) => {
    const productId = params.id
    return {
      success: true,
      message: `Deleted product ${productId}`,
    }
  })
```

---

## 📝 Server-Side Rendering (SSR)

### How SSR Works

1. **Component Loading**: Vue component is dynamically imported from `src/views/`
2. **Rendering**: Component is rendered to string using `renderToString`
3. **Template Integration**: Rendered HTML is injected into `index.html` template
4. **State Injection**: Initial props are injected as `window.__INITIAL_STATE__`

### HTML Template System

The project uses an external `index.html` template for clean separation:

**index.html:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vue SSR with Elysia</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    </style>
  </head>
  <body>
    <div id="app">{{APP_HTML}}</div>
    <script>
      window.__INITIAL_STATE__ = {{INITIAL_STATE}};
    </script>
  </body>
</html>
```

**Server replaces placeholders:**

```typescript
const fullHtml = template
  .replace("{{APP_HTML}}", renderedComponentHtml)
  .replace("{{INITIAL_STATE}}", JSON.stringify(props))
```

Benefits:

- ✅ Clean separation of HTML from TypeScript
- ✅ Easy to modify global styles and meta tags
- ✅ Reusable across all routes
- ✅ Easy to version control and understand

### Passing Data to Components

```typescript
.get('/products', async () => {
  const products = await fetchProducts()

  const props = {
    products: products,
    data: {
      page: 'products',
      title: 'Our Products',
      count: products.length
    }
  }

  const html = await renderPage('Products', props)
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  })
})
```

### Component Props Pattern

```vue
<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
}

interface Props {
  products: Product[]
  data: {
    page: string
    title: string
    count: number
  }
}

defineProps<Props>()
</script>

<template>
  <div>
    <h1>{{ data.title }}</h1>
    <p>Total products: {{ data.count }}</p>
  </div>
</template>
```

---

## 🔧 Development

### Available Scripts

```bash
bun run server      # Start development server with watch mode
bun run build       # Build for production
bun run preview     # Run production preview
bun run dev         # Run Vite dev server (client-side only)
```

### TypeScript Configuration

The project uses strict TypeScript. All files should have proper type annotations.

**tsconfig.json** settings:

- `strict: true` - Enable all strict type checking
- `module: "esnext"` - Use ES modules
- `target: "ES2022"` - Target modern JavaScript

### Code Style Tips

- Use TypeScript interfaces for props and data
- Use `<script setup>` in Vue components
- Scope component styles with `<style scoped>`
- Type API responses with interfaces
- Keep components focused

---

## 🌐 Using window.**INITIAL_STATE**

The server injects initial state as `window.__INITIAL_STATE__`. Access it on the client side:

```typescript
const initialState = window.__INITIAL_STATE__
console.log(initialState.data)
console.log(initialState.users)
```

---

## 📦 Dependencies

### Production

- **elysia** - Fast HTTP framework for Bun
- **vue** - Progressive JavaScript framework

### Development

- **vite** - Next generation frontend tooling
- **@vitejs/plugin-vue** - Vue plugin for Vite
- **typescript** - JavaScript with syntax for types

---

## 🌐 Browser APIs with SSR

### The Challenge

Browser APIs like `window`, `localStorage`, `fetch`, and `document` **don't exist on the server**. Vue components that reference them will crash during SSR.

### Safe Pattern 1: Use `onMounted` Hook

The safest approach is wrapping browser-only code in `onMounted()`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const storedValue = ref<string>('')

onMounted(() => {
  // This only runs in the browser, NOT during SSR
  storedValue.value = localStorage.getItem('myKey') || ''
})
</script>

<template>
  <div>
    <p>Stored value: {{ storedValue }}</p>
  </div>
</template>
```

### Safe Pattern 2: Guard with `typeof` Check

For code outside components, check if `window` exists:

```typescript
// This is safe - checks if running in browser
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme')
  document.body.className = theme || 'light'
}
```

### Safe Pattern 3: Client-Only Components

Create a wrapper that skips SSR:

```vue
<!-- src/views/ClientOnly.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  visible.value = true
})
</script>

<template>
  <div v-if="visible">
    <!-- Only renders in browser -->
    <p>This content is client-only</p>
  </div>
</template>
```

### Common Browser APIs & How to Use Them

#### localStorage / sessionStorage

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const count = ref(0)

onMounted(() => {
  // Load from storage
  const saved = localStorage.getItem('count')
  if (saved) count.value = parseInt(saved)
})

const increment = () => {
  count.value++
  // Save to storage
  localStorage.setItem('count', count.value.toString())
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

#### Fetch & HTTP Requests

```typescript
// Safe pattern in a component
import { ref, onMounted } from 'vue'

const data = ref<any>(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    // This only runs in browser
    const response = await fetch('/api/data')
    data.value = await response.json()
  } finally {
    loading.value = false
  }
})
```

#### Geolocation API

```typescript
import { ref, onMounted } from 'vue'

const location = ref<{ lat: number; lng: number } | null>(null)

onMounted(() => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        location.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      },
      (error) => console.error(error)
    )
  }
})
```

#### IntersectionObserver (Lazy Loading)

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const element = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (element.value && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.value = entry.isIntersecting
    })
    observer.observe(element.value)
  }
})
</script>

<template>
  <div ref="element">
    <div v-if="isVisible" class="lazy-content">
      <!-- Loaded only when visible -->
      <img src="image.jpg" />
    </div>
  </div>
</template>
```

#### Document / DOM Access

```vue
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Safe DOM manipulation in browser only
  document.title = 'New Page Title'
  document.body.style.overflow = 'hidden'

  const element = document.getElementById('myElement')
  if (element) {
    element.style.display = 'none'
  }
})
</script>
```

### Best Practices for Browser APIs

✅ **DO:**

- Use `onMounted()` for all browser API code
- Check `typeof window !== 'undefined'` for utilities
- Initialize state on the server, update on client
- Use refs for client-side state changes

❌ **DON'T:**

- Call `window` at component top level
- Use `localStorage` outside of `onMounted`
- Access DOM at render time
- Use browser APIs in server-side functions

### Pattern for Server + Client Data

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  initialTheme?: string
}

const props = defineProps<Props>()
const theme = ref(props.initialTheme || 'light')

onMounted(() => {
  // Try to load from browser storage
  const saved = localStorage.getItem('theme')
  if (saved) {
    theme.value = saved
    document.documentElement.setAttribute('data-theme', saved)
  }
})

const setTheme = (newTheme: string) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
}
</script>

<template>
  <div>
    <p>Current theme: {{ theme }}</p>
    <button @click="setTheme('dark')">Dark</button>
    <button @click="setTheme('light')">Light</button>
  </div>
</template>
```

---

## 🚀 Build & Deployment

### Development

Start the development server with auto-reload:

```bash
bun run server
# or
bun run dev
```

The server runs on `http://localhost:3000` and automatically reloads when you change files.

### Production Build

Build your application for production:

```bash
bun run build
```

This creates `dist/server.js` - a single bundled file ready for deployment.

### Test Production Build Locally

Before deploying, test the production build:

```bash
bun run preview
```

This runs the production build locally to verify it works.

### Available Scripts

| Script             | Command                                        | Purpose                      |
| ------------------ | ---------------------------------------------- | ---------------------------- |
| `bun run server`   | `bun run --watch src/server/index.ts`         | Start dev with watch mode    |
| `bun run dev`      | `bun run --watch src/server/index.ts`         | Alias for server             |
| `bun run build`    | `bun build src/server/index.ts --outfile ...` | Create production build      |
| `bun run preview`  | `NODE_ENV=production node dist/server.js`     | Run production build locally |

### Project Structure for Production

```
dist/
└── server.js          # Single bundled server file

.env.production        # Production environment variables (optional)
index.html             # Template (copied to dist or embedded)
```

### Environment Variables

Create a `.env.production` file for production settings:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=https://your-database.com
API_KEY=your-api-key
```

Access in code:

```typescript
const dbUrl = process.env.DATABASE_URL
const port = process.env.PORT || 3000
```

### Deployment Options

#### Option 1: Railway (Recommended for Beginners)

1. Push code to GitHub
2. Connect GitHub repo at [railway.app](https://railway.app)
3. Railway automatically detects Bun and builds/deploys
4. Your app is live!

**railway.toml:**

```toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "node dist/server.js"
```

#### Option 2: Vercel (Serverless)

**vercel.json:**

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  }
}
```

Then deploy:

```bash
npm i -g vercel
vercel
```

#### Option 3: Docker

**Dockerfile:**

```dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
```

Build and run:

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

#### Option 4: Render

1. Push to GitHub
2. Create new Web Service at [render.com](https://render.com)
3. Select GitHub repo
4. Set build command: `bun run build`
5. Set start command: `node dist/server.js`
6. Deploy!

#### Option 5: VPS (DigitalOcean, Linode, AWS EC2)

1. SSH into your VPS
2. Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

3. Clone your repo and install:

```bash
git clone <your-repo>
cd <your-repo>
bun install
bun run build
```

4. Use PM2 to keep app running:

```bash
bun add -g pm2
pm2 start dist/server.js --name "my-app"
pm2 startup
pm2 save
```

5. Use Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Performance Optimization

#### Caching

Components are automatically cached. For page-level caching:

```typescript
const cache = new Map<string, { html: string; time: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute

.get('/expensive-page', async () => {
  const cacheKey = 'expensive-page'
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return new Response(cached.html, {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    })
  }

  const html = await renderPage('Expensive', {})
  cache.set(cacheKey, { html, time: Date.now() })

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  })
})
```

#### Compression

Enable gzip compression in your reverse proxy (Nginx, etc.):

```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
```

#### CDN

Use a CDN like Cloudflare for static assets:

```typescript
const CDN_URL = 'https://cdn.yoursite.com'

.get('/', async () => {
  const html = await renderPage('Home', {})
  const withCDN = html.replace('/images/', `${CDN_URL}/images/`)
  return new Response(withCDN, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  })
})
```

### Monitoring & Logs

For production monitoring:

- **Log aggregation**: Use services like Datadog, LogRocket, or Sentry
- **Error tracking**: Sentry for real-time error notifications
- **Uptime monitoring**: Use Uptime Robot or similar
- **Performance monitoring**: New Relic or similar APM

### Common Deployment Issues

**Issue: Build fails with "command not found: bun"**

- Solution: Ensure Bun is installed: `curl -fsSL https://bun.sh/install | bash`

**Issue: Port already in use**

- Solution: Change port in `.env.production` or use `PORT=8000 node dist/server.js`

**Issue: Static files not loading**

- Solution: Serve static files explicitly or use a CDN

**Issue: Database connection fails**

- Solution: Check `.env.production` has correct `DATABASE_URL`

---

## 📚 Common Examples

### Example 1: Simple Data Display

**Route (src/server/index.ts):**

```typescript
.get('/articles', async () => {
  const articles = [
    { id: 1, title: 'Article 1', excerpt: 'First article' },
    { id: 2, title: 'Article 2', excerpt: 'Second article' }
  ]

  const props = {
    articles,
    data: { page: 'articles', title: 'Blog Articles' }
  }

  const html = await renderPage('Articles', props)
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
})
```

**Component (src/views/Articles.vue):**

```vue
<script setup lang="ts">
defineProps<{
  articles: { id: number; title: string; excerpt: string }[]
  data: { page: string; title: string }
}>()
</script>

<template>
  <div>
    <h1>{{ data.title }}</h1>
    <article v-for="article in articles" :key="article.id">
      <h2>{{ article.title }}</h2>
      <p>{{ article.excerpt }}</p>
    </article>
  </div>
</template>
```

### Example 2: Dynamic Routing with Parameters

**Route:**

```typescript
.get('/blog/:slug', async ({ params }) => {
  const article = await fetchArticleBySlug(params.slug)

  if (!article) {
    return new Response('Not found', { status: 404 })
  }

  const props = { article, data: { slug: params.slug } }
  const html = await renderPage('BlogPost', props)
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
})
```

### Example 3: Form Handling & API

**API Endpoint (src/api/routes.ts):**

```typescript
.post('/subscribe', ({ body }) => {
  const { email, name } = body as { email: string; name: string }

  if (!email || !name) {
    return { success: false, message: 'Missing fields' }
  }

  return { success: true, message: 'Subscribed!' }
})
```

### Example 4: Products with Pricing

**Route:**

```typescript
.get('/products', async () => {
  const products = [
    { id: 1, name: 'Product A', price: 99.99 },
    { id: 2, name: 'Product B', price: 149.99 }
  ]

  const props = {
    products,
    data: { page: 'products', title: 'Our Products', count: products.length }
  }

  const html = await renderPage('Products', props)
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
})
```

---

## 🐛 Troubleshooting

### Port Already in Use

Change the port in `src/server/index.ts`:

```typescript
.listen(3001)
```

### Component Not Loading

- Ensure component file exists in `src/views/`
- Check component name matches exactly (case-sensitive)

### TypeScript Errors

```bash
rm -rf node_modules
bun install
```

---

## 🎯 Key Features

✅ Elysia controls all routing
✅ Vue components render server-side
✅ Data injected via `window.__INITIAL_STATE__`
✅ Backend API on same server
✅ Full TypeScript support
✅ Hot reload development
✅ Lightning fast (Bun)

---

---

## 🔄 Complete Request Flow

### Page Request (SSR)

```
User Browser
    ↓
GET /users
    ↓
Elysia Server Receives Request
    ↓
Fetch Data (from DB, API, etc.)
    ↓
Load Users.vue Component
    ↓
Render to HTML String (renderToString)
    ↓
Inject window.__INITIAL_STATE__ with data
    ↓
Return Full HTML Document
    ↓
Browser Receives & Displays Complete Page
```

### API Request (JSON)

```
User Browser / Frontend Code
    ↓
GET /api/users
    ↓
Elysia Server Receives Request
    ↓
Fetch Data from Database
    ↓
Return JSON Response
    ↓
Frontend JavaScript Processes JSON
    ↓
Update DOM if Needed
```

---

## 🎯 Key Architectural Principles

### 1. Elysia Controls Everything

- No Vue Router - Elysia decides all routing
- Server determines what content is rendered
- URLs are controlled on the backend
- Better for SEO and security

### 2. Server-Side Rendering First

- All HTML is generated on the server
- Browser receives fully-formed pages
- Faster initial load times
- Better for search engine indexing

### 3. Data Injection Pattern

- Server prepares data in route handlers
- Data passed to Vue components as props
- Also injected as `window.__INITIAL_STATE__`
- Frontend can access via JavaScript

### 4. Dual API Pattern

- **Page routes**: Return rendered HTML with data injected
- **API routes**: Return JSON for frontend to consume
- Can use same data source for both
- Flexible architecture for different clients

---

## 🔍 File Roles Summary

| File                  | Purpose                 | Key Pattern                        |
| --------------------- | ----------------------- | ---------------------------------- |
| `src/server/index.ts` | All page routes and SSR | `renderPage(componentName, props)` |
| `src/api/routes.ts`   | JSON API endpoints      | `Elysia plugin with /api prefix`   |
| `src/views/*.vue`     | Vue page components     | `<script setup>` with TypeScript   |
| `package.json`        | Dependencies & scripts  | `bun run server` to start          |

---

## 💡 Best Practices

1. **Keep routes organized** - Page routes in index.ts, API routes in api/routes.ts
2. **Type everything** - Use TypeScript interfaces for props and data
3. **Reuse components** - Create small, focused `.vue` files with props
4. **Error handling** - Wrap SSR operations in try-catch
5. **Validate input** - Check query params and body data in routes
6. **Cache wisely** - Component cache is built-in, add page-level caching as needed
7. **Separate concerns** - Data fetching in routes, rendering in components

---

## 🚀 Next Steps

1. ✅ **Understand the setup** - Read this README
2. 🛣️ **Add your routes** - Create new pages in `src/server/index.ts`
3. 🎨 **Create components** - Build `.vue` files in `src/views/`
4. 📡 **Build APIs** - Add endpoints in `src/api/routes.ts`
5. 🗄️ **Connect database** - Integrate your data source
6. 🌐 **Deploy** - Push to production

---

## ❓ FAQ

**Q: How do I pass data from server to Vue?**
A: Return it in the `props` object when calling `renderPage()`. It becomes accessible in Vue and also in `window.__INITIAL_STATE__`.

**Q: Can I use Vue Router?**
A: Technically yes, but it defeats the purpose. Elysia controls routing for better SSR, SEO, and security.

**Q: How do I protect routes?**
A: Use Elysia middleware before route handlers. Check authentication/authorization before rendering.

**Q: Can I mix SPA and SSR routes?**
A: Yes! API routes serve data, page routes serve HTML. Combine as needed.

**Q: How do I handle errors?**
A: Return appropriate HTTP status codes and use try-catch blocks in route handlers.

**Q: Is this production-ready?**
A: Yes! Bun is production-ready, Elysia is battle-tested, Vue SSR is standard practice.

---

**All documentation has been consolidated into this README.** Happy building! 🚀

Enjoy building with Elysia + Vue SSR! 🦊 🚀
