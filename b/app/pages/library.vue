<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Media Library</h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div
        v-for="item in media"
        :key="item._id.$oid"
        class="border border-gray-300 rounded-lg overflow-hidden text-center"
      >
        <img
          :src="item.path"
          :alt="item.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-2 font-bold">{{ item.title }}</div>
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
