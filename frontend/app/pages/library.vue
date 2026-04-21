<template>
  <div class="bg-gray-100 min-h-screen p-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">
      Media Library
    </h1>
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
        v-for="item in media"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
let modalView = ref<boolean>(false);
let selectedItem = ref<any>(null);
// leave the type any for now gotta test if it works
function openLibraryItem(x: any) {
  modalView.value = true;
  selectedItem.value = x;
  console.log(x);
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
