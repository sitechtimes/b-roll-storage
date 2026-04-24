<template>
  <header class="border-b border-gray-200 bg-white/80 backdrop-blur">
    <nav class="flex items-center justify-between px-2 py-1.5">
      <div class="flex items-center gap-1">
        <NuxtLink
          to="/upload"
          class="rounded-md px-2.5 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >Upload</NuxtLink
        >
        <NuxtLink
          to="/library"
          class="rounded-md px-2.5 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >Library</NuxtLink
        >
      </div>
      <button
        class="rounded-md px-2.5 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
        @click="logout()"
      >
        Logout
      </button>
    </nav>
  </header>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
function logout() {
  auth.logout();
  navigateTo("/login");
}
</script>
