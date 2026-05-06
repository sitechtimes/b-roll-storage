import { defineStore } from "pinia";
import { ref } from "vue";

export const useViewHistoryStore = defineStore(
  "viewHistory",
  () => {
    const history = ref<any[]>([]);

    function addToHistory(item: any) {
      history.value.unshift(item);
    }

    function clearHistory() {
      history.value = [];
    }

    return {
      history,
      addToHistory,
      clearHistory,
    };
  },
  {
    persist: true,
  }
);
