import { defineStore } from "pinia";
import { ref } from "vue";

export const useViewHistoryStore = defineStore(
  "viewHistory",
  () => {
    const history = ref<any[]>([]);

    function addToHistory(item: any) {
      if (history.value[0] !== item) {
        if (history.value.includes(item)) {
          history.value.splice(history.value.indexOf(item), 1);
        }
        history.value.unshift(item);
      }
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
  } as any
);
