<template>
  <div class="bg-gray-100 min-h-screen p-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">
      Media Library
    </h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <div
        v-for="item in media"
        :key="item._id.$oid"
        class="bg-white rounded-lg shadow-md overflow-hidden text-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        <img
          :src="item.path"
          :alt="item.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <div class="font-bold text-lg mb-2 text-gray-900">
            {{ item.title }}
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Media {
  _id: {
    $oid: string;
  };
  title: string;
  type: string;
  tags: string[];
  path: string;
}

const media = ref<Media[]>([]);

onMounted(async () => {
  try {
    const response = await fetch("/test-data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    media.value = await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
});
</script>
