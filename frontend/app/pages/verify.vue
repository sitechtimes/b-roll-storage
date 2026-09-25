<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 bg-base-200/40"
  >
    <div class="card bg-base-100 w-full max-w-md shadow-sm">
      <div class="card-body p-8 md:p-10">
        <div
          class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 4.5 5.25h15a2.25 2.25 0 0 1 2.25 2.25Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m3 6 7.364 5.154a2.85 2.85 0 0 0 3.272 0L21 6"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-center text-base-content">
          Verify your email
        </h1>

        <p class="text-sm text-base-content/70 text-center mt-2 mb-6">
          We sent a six-digit verification code to
          <strong class="text-base-content break-all">{{ email }}</strong>.
        </p>

        <form class="space-y-4" @submit.prevent="handleVerify">
          <label class="form-control w-full">
            <span class="label">
              <span class="label-text font-medium">Verification code</span>
            </span>

            <input
              v-model="code"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="000001"
              class="input input-bordered w-full text-center text-2xl tracking-[0.35em]"
              required
            />
          </label>

          <p v-if="errorMessage" class="text-sm text-error">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="text-sm text-success">
            {{ successMessage }}
          </p>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="loading loading-spinner loading-xs mr-1"
            ></span>
            {{ isSubmitting ? "Verifying..." : "Verify account" }}
          </button>

          <NuxtLink to="/login" class="btn btn-outline w-full">
            Back to login
          </NuxtLink>
        </form>

        <p class="text-xs text-center text-base-content/60 mt-5">
          Check your spam folder if you cannot find the email.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const route = useRoute();
const email = ref(String(route.query.email ?? ""));
const code = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const API_BASE = "http://localhost:3001";

async function handleVerify() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value) {
    errorMessage.value = "Your email address is missing.";
    return;
  }

  if (!/^\d{6}$/.test(code.value)) {
    errorMessage.value = "Enter the six-digit code from your email.";
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch(`${API_BASE}/auth/verify-code`, {
      method: "POST",
      body: {
        email: email.value,
        code: code.value,
      },
    });

    successMessage.value = "Your account has been verified.";

    setTimeout(() => {
      navigateTo("/login");
    }, 900);
  } catch (error: any) {
    errorMessage.value =
      error?.data?.error || "Unable to verify your account.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>