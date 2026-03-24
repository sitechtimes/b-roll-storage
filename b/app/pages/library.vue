<template>
  <div class="library-container">
    <h1>Media Library</h1>
    <div class="media-grid">
      <div v-for="item in media" :key="item._id.$oid" class="media-item">
        <img :src="item.path" :alt="item.title" class="media-image" />
        <div class="media-title">{{ item.title }}</div>
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

<style scoped>
.library-container {
  padding: 2rem;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.media-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
}

.media-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.media-title {
  padding: 0.5rem;
  font-weight: bold;
}
</style>
