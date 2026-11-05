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

          <h1 id="verify-title" class="text-3xl font-bold text-base-content">
            Verify your email
          </h1>
          <p class="mt-3 text-base leading-7 text-base-content/70">
            A verification email was sent if you signed up.
            Enter the email address to send/resend the verification email.
          </p>

          <form class="mt-2 w-full space-y-4" @submit.prevent="handleSendVerification()">
            <label class="form-control w-full text-left">
              <span class="label">
                <span class="label-text font-medium ">Email address</span>
              </span>
              <input
                v-model.trim="verify.email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="input input-bordered w-full mt-2"
                required
              />
            </label>

            <button
              type="submit"
              class="btn btn-primary w-full mt-2"
              :disabled="countdown > 0"
            >
              {{
                countdown > 0
                  ? `Try again in ${countdown}s`
                  : "Send verification email"
              }}
            </button>
          </form>

          <p v-if="verify.errorMessage" class="text-sm text-error">
            {{ verify.errorMessage }}
          </p>

          <p class="mt-2 text-sm text-base-content/60">
            Already requested a link? Check your inbox and spam folder.
          </p>

          <NuxtLink to="/login" class="btn btn-outline mt-2 w-full">
            Back to login
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { useVerifyStore } from "~/stores/verify";

const verify = useVerifyStore();
const countdown = ref(0);
let countdownInterval: ReturnType<typeof setInterval> | undefined;

async function handleSendVerification() {
  await verify.sendVerification();

  if (!verify.errorMessage) {
    startCountdown();
  }
}

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
