
<script setup lang="ts">
defineProps<{
  data: Record<string, any>
  content: string
}>()
</script>

<template>
  <div class="page about-page">
    <header>
      <nav>
        <a href="/">🏠 Home</a>
        <a href="/about">ℹ️ About</a>
        <a href="/users">👥 Users</a>
        <a href="/api/hello">📡 API Test</a>
      </nav>
    </header>

    <main>
      <h1>About This Project</h1>

      <section>
        <h2>What is Elysia + Vue SSR?</h2>
        <p>{{ content }}</p>
      </section>

      <section>
        <h2>Architecture</h2>
        <div class="architecture">
          <div class="component">
            <h3>Frontend</h3>
            <p>Vue 3 Components (.vue files)</p>
          </div>
          <div class="arrow">→</div>
          <div class="component">
            <h3>Server</h3>
            <p>Elysia on Bun</p>
          </div>
          <div class="arrow">→</div>
          <div class="component">
            <h3>API</h3>
            <p>JSON Endpoints</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Server Data</h2>
        <div class="data-box">
          <pre>{{ JSON.stringify(data, null, 2) }}</pre>
        </div>
      </section>

      <section>
        <h2>Key Benefits</h2>
        <ul>
          <li><strong>Elysia Controls Routing:</strong> Server decides what to render</li>
          <li><strong>SSR Performance:</strong> HTML rendered on server, sent to browser</li>
          <li><strong>SEO Friendly:</strong> Full HTML with content for search engines</li>
          <li><strong>Type Safe:</strong> Full TypeScript from backend to frontend</li>
          <li><strong>Fast Development:</strong> Hot reload and instant feedback</li>
          <li><strong>Single Server:</strong> API and UI from same Elysia instance</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page {
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
}

nav a:hover {
  background: #e0e0e0;
}

main {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

section {
  margin-bottom: 40px;
}

h2 {
  color: #333;
  border-bottom: 2px solid #0066cc;
  padding-bottom: 10px;
}

.architecture {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.component {
  flex: 1;
  min-width: 150px;
  background: #e8f4f8;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.component h3 {
  margin: 0 0 10px 0;
  color: #0066cc;
}

.component p {
  margin: 0;
  font-size: 0.9em;
}

.arrow {
  font-size: 24px;
  color: #0066cc;
  font-weight: bold;
}

.data-box {
  background: #e8f4f8;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 0.85em;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 12px;
  margin: 10px 0;
  background: #f9f9f9;
  border-left: 4px solid #0066cc;
  border-radius: 3px;
}
</style>
