import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./auth";

interface Media {
  id: string;
  title: string;
  type: "image" | "video";
  tags: string[];
  path: string;
}

export const useMediaStore = defineStore("media", () => {
  const auth = useAuthStore();
  const backend = useRuntimeConfig().public.backend;
  const tokenCookie = useCookie<string | null>("auth_token", {
    default: () => null,
  });
  const userIdCookie = useCookie<string | null>("user_id", {
    default: () => null,
  });
  const media = ref<Media[]>([]);
  const history = ref<Media[]>([]);
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

  async function saveRecents(recents: string[]) {
    const userId = auth.user?.id ?? userIdCookie.value;
    const token = tokenCookie.value;
    if (!userId || !token) {
      throw new Error("You must be signed in to save history");
    }
    return $fetch(`${backend}/users/${userId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { recents },
    });
  }

  async function fetchHistory() {
    const userId = auth.user?.id ?? userIdCookie.value;
    const token = tokenCookie.value;
    if (!auth.isLoggedIn || !userId || !token) {
      history.value = [];
      return history.value;
    }

    const account = await $fetch<{ recents: string[] }>(
      `${backend}/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    history.value = (account.recents ?? [])
      .map((id) => media.value.find((item) => item.id === id))
      .filter((item): item is Media => item !== undefined);
    return history.value;
  }

  return {
    media,
    filteredMedia,
    searchQuery,
    fetchMedia,
    saveRecents,
    fetchHistory,
    history,
  };
});