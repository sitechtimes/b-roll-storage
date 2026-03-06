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
            <video
              ref="videoElement"
              class="w-full rounded-lg mb-4"
              controls
              @loadedmetadata="captureFrame"
            ></video>
          </div>
        </div>
        <div class="py-6 w-full">
          <p>Tag holders</p>
        </div>

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

const hasFile: { value: boolean } = ref(false); // dont delete ascctualy important
const videoFile = ref<File | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const thumbnailImage: { value: string } = ref("");

const onFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const uploadedFile = input.files?.[0]; // grabs the upload file

  if (uploadedFile) {
    // works if there is something uploaded
    videoFile.value = uploadedFile;
    hasFile.value = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (videoElement.value && e.target?.result) {
        videoElement.value.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(uploadedFile);
  }
};

function captureFrame() {
  if (videoElement.value) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.value.videoWidth;
    canvas.height = videoElement.value.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoElement.value, 0, 0);
      thumbnailImage.value = canvas.toDataURL("image/png");
    }
  }
}

function test() {
  console.log("Ai test");
}
</script>
