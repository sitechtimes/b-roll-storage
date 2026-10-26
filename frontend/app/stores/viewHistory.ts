import { defineStore } from "pinia";
import { ref } from "vue";

export const useViewHistoryStore = defineStore(
  "viewHistory",
  () => {
    const history = ref<any[]>([]);
    const user = ref<any>(null);
    const tokenCookie = useCookie<string | null>("token", {
      default: () => null,
    });
    const backend = useRuntimeConfig().public.backendUrl;

    function addToHistory(item: any) {
      if (history.value[0] !== item) {
        if (history.value.includes(item)) {
          history.value.splice(history.value.indexOf(item), 1);
        }
        history.value.unshift(item);
      }
    }

    async function saveRecents(recents: string[]) {
    const userId = user.value?.id;
    const token = tokenCookie.value;
    if(!userId || !token) {
      throw new Error("You must be signed in to save history");
    }
    return $fetch(`${backend}/users/${userId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { recents },
    });
  }

    function clearHistory() {
      history.value = [];
    }
  
    return {
      history,
      addToHistory,
      clearHistory,
      saveRecents,
    };  
  },
  {
    persist: true,
  } as any
);
