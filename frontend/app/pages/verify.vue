<template>
  <div
    class="flex min-h-screen items-center justify-center bg-base-200/40 px-4 py-10"
  >
    <main class="w-full max-w-md">
      <section
        class="card border border-base-300 bg-base-100 shadow-sm"
        aria-labelledby="verify-title"
      >
        <div class="card-body items-center p-8 text-center sm:p-10">
          <div
            class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <svg
              class="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2"></rect>
              <path d="m3 7 9 6 9-6"></path>
            </svg>
          </div>

          <h1
            id="verify-title"
            class="text-3xl font-bold text-base-content"
          >
            Check your email
          </h1>
          <p class="mt-3 text-base leading-7 text-base-content/70">
            We’ve sent you a verification link. Open the email and click the
            link to finish setting up your account.
          </p>

          <div
            class="mt-6 w-full rounded-lg bg-base-200/70 p-4 text-left"
          >
            <p class="text-sm leading-6 text-base-content/70">
              <span class="font-semibold text-base-content">No email?</span>
              Check your spam or junk folder. It may take a few minutes to
              arrive.
            </p>
          </div>

          <button
            type="button"
            class="btn btn-outline mt-6 w-full"
            :disabled="countdown > 0"
            @click="startCountdown"
          >
            {{
              countdown > 0
                ? `Resend available in ${countdown}s`
                : "Resend verification email"
            }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";

const countdown = ref(0);
let countdownInterval: ReturnType<typeof setInterval> | undefined;

function startCountdown() {
  if (countdown.value > 0) {
    return;
  }

  countdown.value = 60;
  countdownInterval = setInterval(() => {
    countdown.value -= 1;

    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = undefined;
    }
  }, 1000);
}

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

</script>
