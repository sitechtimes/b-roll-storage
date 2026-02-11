<script setup lang="ts"></script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
nav {
  padding: 1rem;
}
nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #42b983;
}
main {
  padding: 1rem;
}
</style>
