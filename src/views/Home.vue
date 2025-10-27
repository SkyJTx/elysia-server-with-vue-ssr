<script setup lang="ts">
defineProps<{
  data: Record<string, any>
  path: string
}>()
</script>

<template>
  <div class="page home-page">
    <header>
      <nav>
        <a href="/">🏠 Home</a>
        <a href="/about">ℹ️ About</a>
        <a href="/users">👥 Users</a>
        <a href="/api/hello">📡 API Test</a>
      </nav>
    </header>

    <main>
      <h1>Welcome to Elysia + Vue SSR</h1>
      <p><strong>Current Path:</strong> {{ path }}</p>
      <p>This page was server-side rendered by Elysia using Vue components!</p>

      <div class="data-box">
        <h3>📦 Data from Elysia Server</h3>
        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
      </div>

      <section class="features">
        <h2>Features</h2>
        <ul>
          <li>✅ Elysia controls Vue routing</li>
          <li>✅ Server-side rendering with .vue files</li>
          <li>✅ Data passed from server to Vue</li>
          <li>✅ Full TypeScript support</li>
          <li>✅ Hot reload development</li>
          <li>✅ Lightning fast on Bun</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

header {
  padding: 20px;
  background: #f0f0f0;
  margin-bottom: 20px;
}

nav {
  display: flex;
  gap: 15px;
}

nav a {
  color: #0066cc;
  text-decoration: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

nav a:hover {
  background: #e0e0e0;
  text-decoration: underline;
}

main {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin: 20px 0;
  color: #333;
}

.data-box {
  background: #e8f4f8;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
}

.data-box h3 {
  margin-top: 0;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 0.9em;
}

.features {
  margin-top: 40px;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 10px;
  margin: 8px 0;
  background: #f9f9f9;
  border-left: 4px solid #0066cc;
  border-radius: 3px;
}
</style>
