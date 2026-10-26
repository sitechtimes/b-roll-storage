import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMediaStore = defineStore("media", () => {
  const backend = useRuntimeConfig().public.backend;
  interface Media {
    id: string;
    title: string;
    type: "image" | "video";
    tags: string[];
    path: string;
  }

  const media = ref<Media[]>([]);
  const searchQuery = ref("");

  const filteredMedia = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      return media.value;
    }

    return media.value.filter((item) => {
      const tags = item.tags?.join(" ") ?? "";
      const searchable = `${item.title} ${item.type} ${tags}`.toLowerCase();
      return searchable.includes(query);
    });
  });

  async function fetchMedia() {
    media.value = await $fetch<Media[]>(`${backend}/medias`);
  }
  return {
    media,
    searchQuery,
    filteredMedia,
    fetchMedia,
  };
});
