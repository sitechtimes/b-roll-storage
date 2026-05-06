<template>
  <div class="flex bg-gray-100 min-h-screen p-4">
    <!-- Sidebar -->
    <div class="w-64 h-[100vh] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <div class="p-6 overflow-y-auto flex-1">
        <h2 class="text-xl font-bold text-gray-800 mb-4">View History</h2>
        <div v-if="history.length === 0" class="text-sm text-gray-500">
          No history yet
        </div>
        <ul class="space-y-2">
          <li
            v-for="(item, index) in history"
            :key="index"
            class="p-3 rounded-lg bg-gray-50 hover:bg-blue-100 cursor-pointer transition-colors"
            @click="openHistoryItem(item)"
          >
            <p class="font-medium text-gray-800 text-sm truncate">
              {{ item.title }}
            </p>
            <p class="text-xs text-gray-500">{{ item.tags.join(", ") }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">
        Media Library
      </h1>
      <div class="w-1/2 mx-auto mb-8">
        <label class="input input-bordered flex items-center gap-2 w-full">
          <input
            v-model.trim="searchQuery"
            type="search"
            placeholder="Search by title, type, or tag"
            class="grow w-full"
          />
        </label>
        <p class="text-sm text-gray-500 mt-2 text-center">
          Showing {{ filteredMedia.length }} of {{ media.length }} items
        </p>
      </div>
      <div v-if="modalView">
        <dialog class="modal" open>
          <div class="modal-box">
            <div>
              <h3 class="text-lg font-bold">Video Details</h3>
              <p class="py-4">Title: {{ selectedItem.title }}</p>
              <img
                :src="selectedItem.path"
                :alt="selectedItem.title"
                class="w-full h-48 object-cover"
              />
              <p class="py-4">Type: {{ selectedItem.type }}</p>
              <p class="py-4">Tags: {{ selectedItem.tags.join(", ") }}</p>
              <button class="btn" @click="closeLibraryItem()">Close</button>
            </div>
          </div>
        </dialog>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <div
          v-for="item in filteredMedia"
          :key="item._id.$oid"
          class="bg-white rounded-lg shadow-md overflow-hidden text-center transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          @click="openLibraryItem(item)"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
let modalView = ref<boolean>(false);
let selectedItem = ref<any>(null);
let history = ref<any[]>([]);
const searchQuery = ref("");

function viewHistory(item: any) {
  history.value.unshift(item);
}

function openLibraryItem(x: any) {
  modalView.value = true;
  selectedItem.value = x;
  viewHistory(x);
}

function openHistoryItem(item: any) {
  modalView.value = true;
  selectedItem.value = item;
}

function closeLibraryItem() {
  modalView.value = false;
}

/* below is just for the test data file in here for now */
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
