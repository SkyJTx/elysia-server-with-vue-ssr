<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  role?: string
}

defineProps<{
  users: User[]
  data: Record<string, any>
  path: string
}>()
</script>

<template>
  <div class="page users-page">
    <header>
      <nav>
        <a href="/">🏠 Home</a>
        <a href="/about">ℹ️ About</a>
        <a href="/users">👥 Users</a>
        <a href="/api/hello">📡 API Test</a>
      </nav>
    </header>

    <main>
      <h1>Users Directory</h1>
      <p><strong>Current Path:</strong> {{ path }}</p>
      <p>This data was fetched by Elysia and rendered server-side with Vue components.</p>

      <section v-if="users.length > 0" class="users-section">
        <h2>Users List ({{ users.length }} users)</h2>
        <div class="users-grid">
          <div v-for="user in users" :key="user.id" class="user-card">
            <h3>{{ user.name }}</h3>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p v-if="user.role"><strong>Role:</strong> {{ user.role }}</p>
            <a :href="`/api/users/${user.id}`" class="api-link">📡 View API Data</a>
          </div>
        </div>
      </section>

      <section v-else class="empty-state">
        <p>No users found</p>
      </section>

      <section class="data-section">
        <h2>Server State</h2>
        <div class="data-box">
          <pre>{{ JSON.stringify(data, null, 2) }}</pre>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.users-page {
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
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin: 0 0 20px 0;
  color: #333;
}

h2 {
  color: #333;
  border-bottom: 2px solid #0066cc;
  padding-bottom: 10px;
  margin-top: 30px;
}

section {
  margin-bottom: 40px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.user-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #0066cc;
}

.user-card h3 {
  margin: 0 0 15px 0;
  color: #0066cc;
}

.user-card p {
  margin: 8px 0;
  font-size: 0.95em;
}

.api-link {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 12px;
  background: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.85em;
  transition: background 0.2s;
}

.api-link:hover {
  background: #0052a3;
}

.empty-state {
  background: #fff3cd;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #856404;
}

.data-section {
  margin-top: 40px;
}

.data-box {
  background: #e8f4f8;
  padding: 15px;
  border-radius: 5px;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 0.85em;
  margin: 10px 0 0 0;
}
</style>
