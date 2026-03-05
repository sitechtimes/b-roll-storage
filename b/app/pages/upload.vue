<template>
  <div class="min-h-screen flex items-center justify-center">
    <div
      class="card bg-base-100 w-[95vw] max-w-2xl md:max-w-3xl min-h-105 md:min-h-130 shadow-sm"
    >
      <div class="card-body items-center text-center p-8 md:p-10">
        <h2 class="card-title text-4xl">B roll upload</h2>

        <div
          class="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 cursor-pointer hover:border-gray-400 transition"
        >
          <div v-if="!hasFile">
            <input
              type="file"
              accept="video/*"
              class="hidden"
              id="videoUpload"
              @change="onFileUpload"
            />
            <label
              for="videoUpload"
              class="flex flex-col items-center justify-center cursor-pointer"
            >
              <svg
                class="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p class="text-sm text-gray-500">Drop video or click to upload</p>
              <p class="text-xs text-gray-400">MP4, MOV, Others</p>
            </label>
          </div>
          <div v-if="hasFile">
            <p>th files are real</p>
          </div>
        </div>

        <p>Tag holders</p>
        <div class="card-actions">
          <button
            class="btn btn-primary absolute bottom-4 left-4 right-4"
            @click="test()"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const hasFile = ref(false);
const videoFile = ref<File | null>(null);
const videoBlobUrl = ref<string | null>(null);

const onFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const uploadedFile = input.files?.[0];

  if (uploadedFile) {
    videoFile.value = uploadedFile;
    videoBlobUrl.value = URL.createObjectURL(uploadedFile);
    hasFile.value = true;
    console.log("File:", uploadedFile.name);
    console.log("Blob URL:", videoBlobUrl.value);
  }
};

function test() {
  console.log("File object:", videoFile.value);
  console.log("Blob URL:", videoBlobUrl.value);
}
</script>
