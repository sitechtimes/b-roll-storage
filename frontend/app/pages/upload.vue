<template>
  <div
    class="min-h-screen flex items-center justify-center bg-base-200/40 p-4 font-sans"
  >
    <div
      class="card bg-base-100 w-full max-w-2xl shadow-xl border border-base-200/60 rounded-[2rem]"
    >
      <div class="card-body p-8 md:p-12">
        <div class="mb-8 text-center">
          <h2
            class="text-3xl md:text-4xl font-extrabold text-base-content tracking-tight mb-3"
          >
            Upload B-Roll
          </h2>
          <p class="text-base-content/60 font-medium text-sm">
            Add your video footage to the media library
          </p>
        </div>

        <!-- Upload Dropzone -->
        <div
          class="w-full border-2 border-dashed border-base-300 rounded-[1.5rem] p-2 mb-2 transition-all duration-300 group overflow-hidden"
          :class="{
            'hover:border-primary/50 hover:bg-base-200/50 cursor-pointer':
              !hasFile,
          }"
        >
          <div
            v-if="!hasFile"
            class="py-16 md:py-20 flex flex-col items-center justify-center"
          >
            <input
              type="file"
              accept="video/*"
              class="hidden"
              id="videoUpload"
              @change="onFileUpload"
            />
            <label
              for="videoUpload"
              class="flex flex-col items-center justify-center cursor-pointer w-full h-full"
            >
              <div
                class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p class="text-base font-bold text-base-content mb-1">
                Click to upload or drag & drop
              </p>
              <p class="text-xs text-base-content/50 font-medium">
                MP4, MOV, WEBM (Max 100MB)
              </p>
            </label>
          </div>

          <div
            v-else
            class="relative w-full rounded-2xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center mx-auto shadow-inner"
          >
            <video
              ref="videoElement"
              class="w-full h-full object-contain rounded-2xl block"
              controls
              @loadedmetadata="captureFrame"
            ></video>
          </div>
        </div>

        <!-- File Info & Remove -->
        <div
          v-if="hasFile"
          class="flex flex-wrap justify-between items-center px-4 mb-2 pb-6 border-b border-base-200"
        >
          <div class="flex items-center gap-2 max-w-[70%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-primary opacity-80 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span class="text-sm font-semibold text-base-content/80 truncate">{{
              finalVideoFile.fileName
            }}</span>
          </div>
          <button
            class="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-lg"
            @click="afterSubmit"
          >
            Remove
          </button>
        </div>

        <div v-if="!hasFile" class="divider divider-neutral mb-8 opacity-20">
          Settings
        </div>

        <!-- Metadata Section -->
        <div class="mt-4 flex flex-col md:flex-row gap-4 items-start w-full">
          <!-- Tag Selector -->
          <div class="dropdown w-full md:w-[40%] text-left">
            <div
              tabindex="0"
              role="button"
              class="btn w-full justify-between bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/50 text-base-content/80 font-medium rounded-xl shadow-sm input-md h-12 flex items-center"
            >
              <span>Select Tags</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-xl w-full mt-2 border border-base-200 z-50"
            >
              <li v-for="tag in tags" :key="tag">
                <a
                  class="rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm font-semibold"
                  @click="addTagToFinalFile(tag)"
                >
                  {{ tag }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Active Tags Area -->
          <div
            class="w-full md:w-[60%] min-h-12 bg-base-200/30 rounded-xl p-2.5 border border-base-200/70 flex flex-wrap gap-2 items-center"
          >
            <span
              v-if="finalVideoFile.tags.length === 0"
              class="text-sm text-base-content/40 italic px-2"
              >No tags selected...</span
            >
            <span
              v-for="tag in finalVideoFile.tags"
              :key="tag"
              class="badge badge-primary badge-outline gap-1.5 py-3 px-3 shadow-sm bg-base-100 font-medium border-primary/30"
            >
              {{ tag }}
              <button
                class="btn btn-ghost btn-xs btn-circle h-4 w-4 min-h-0 text-base-content/40 hover:bg-error hover:border-error hover:text-white transition-colors"
                @click="removeTag(tag)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-2.5 w-2.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </span>
          </div>
        </div>

        <!-- Action Area -->
        <div class="mt-10 mb-2">
          <button
            class="btn btn-primary w-full h-14 text-base shadow-lg shadow-primary/20 rounded-xl hover:shadow-primary/40 transition-all font-bold"
            :disabled="!hasFile"
            @click="afterSubmit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload Media
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
