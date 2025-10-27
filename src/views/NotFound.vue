<script setup lang="ts">
interface Props {
  path: string
}

defineProps<Props>()
</script>

<template>
  <div class="not-found">
    <header>
      <nav class="nav">
        <a href="/">🏠 Home</a>
      </nav>
    </header>
    <main class="container">
      <h1 class="error-title">404 - Page Not Found</h1>
      <p class="error-path">The path <code>{{ path }}</code> doesn't exist.</p>
      <p class="error-message">Sorry, we couldn't find what you're looking for!</p>
      <nav class="links">
        <a href="/" class="link-home">Back to Home</a>
      </nav>
    </main>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

.nav {
  background: #f0f0f0;
  padding: 20px;
  display: flex;
  gap: 20px;
}

.nav a {
  color: #0066cc;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
}

.nav a:hover {
  text-decoration: underline;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  background: white;
  margin: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 3em;
  color: #d32f2f;
  margin-bottom: 20px;
}

.error-path {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 15px;
  font-family: monospace;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 5px;
  display: inline-block;
}

.error-path code {
  color: #d32f2f;
}

.error-message {
  font-size: 1.1em;
  color: #888;
  margin-bottom: 30px;
}

.links {
  display: flex;
  gap: 15px;
}

.link-home {
  background: #0066cc;
  color: white;
  padding: 12px 30px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.link-home:hover {
  background: #0052a3;
}
</style>
