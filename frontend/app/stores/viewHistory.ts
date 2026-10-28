import { defineStore } from "pinia";
import { ref } from "vue";

export const useViewHistoryStore = defineStore(
  "viewHistory",
  () => {
    const history = ref<any[]>([]);
    const auth = useAuthStore();
    const backend = useRuntimeConfig().public.backend;

    function addToHistory(item: any) {
      if (history.value[0] !== item) {
        if (history.value.includes(item)) {
          history.value.splice(history.value.indexOf(item), 1);
        }
        history.value.unshift(item);
      }
    }

    async function saveRecents(recents: string[]) {
      const userId = auth.userId;
      const token = auth.token;
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
  const userId = auth.userId;
  const token = auth.token;
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
    .map((id) => useMediaStore().media.find((item) => item.id === id))
    .filter((item): item is any => item !== undefined);
  return history.value;
}

    async function clearHistory() {
      history.value = [];
      if (auth.userId && auth.token) {
        await saveRecents([]);
      }
      return history.value;
    }

    return {
      history,
      addToHistory,
      clearHistory,
      saveRecents,
      fetchHistory,
    };
  },
  {
    persist: true,
  } as any,
);
