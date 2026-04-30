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
        <div v-if="finalVideoFile.tags.length > 0" class="w-full text-center">
          <p class="text-sm font-semibold mb-2">Selected Tags:</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="tag in finalVideoFile.tags"
              :key="tag"
              class="badge badge-secondary gap-2 py-3 px-3"
            >
              {{ tag }}
              <button
                class="btn btn-ghost btn-xs rounded-full hover:bg-red-500 hover:text-white transition cursor-pointer"
                @click="removeTag(tag)"
              >
                ✕
              </button>
            </span>
          </div>
        </div>

        <div class="py-6 w-full">
          <div class="dropdown dropdown-bottom w-full">
            <div
              tabindex="0"
              role="button"
              class="btn btn-outline w-full justify-between"
            >
              <span>Select Tags</span>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-lg z-10 w-full mt-2 p-2 shadow-lg border border-base-300"
            >
              <li v-for="tag in tags" :key="tag">
                <a class="rounded-md" @click="addTagToFinalFile(tag)">
                  {{ tag }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="card-actions">
          <button
            class="btn btn-primary absolute bottom-4 left-4 right-4"
            @click="afterSubmit"
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

const finalVideoFile = ref<{ fileName: string; tags: string[] }>({
  fileName: "",
  tags: [],
});

const auth = useAuthStore();

const tags: string[] = ["Tag1", "Tag2", "Tag3"];

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
    finalVideoFile.value.fileName = uploadedFile.name;
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

function removeTag(x: string) {
  if (finalVideoFile.value.tags.includes(x)) {
    const tagToRemove: number = finalVideoFile.value.tags.indexOf(x);
    if (tagToRemove > -1) {
      finalVideoFile.value.tags.splice(tagToRemove, 1);
    }
  }
}

function addTagToFinalFile(x: string) {
  if (finalVideoFile.value.tags.includes(x)) {
  } else {
    finalVideoFile.value.tags.push(x);
  }
}

function afterSubmit() {
  finalVideoFile.value = { fileName: "", tags: [] };
  hasFile.value = false;
  videoFile.value = null;
  if (videoElement.value) {
    videoElement.value.src = "";
  }
  thumbnailImage.value = "";
}
</script>
