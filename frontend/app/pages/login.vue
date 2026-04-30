<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 bg-base-200/40"
  >
    <div class="card bg-base-100 w-full max-w-md shadow-sm">
      <div class="card-body p-8 md:p-10">
        <h1 class="text-3xl font-bold text-center text-base-content">Login</h1>
        <p class="text-sm text-base-content/70 text-center mt-1 mb-4">
          Sign in to upload your B-roll.
        </p>

        <form class="space-y-4 mt-1" @submit.prevent="handleLogin">
          <label class="form-control w-full">
            <span class="label">
              <span class="label-text font-medium">Email</span>
            </span>
            <input
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="input input-bordered w-full"
              required
            />
          </label>

          <label class="form-control w-full">
            <span class="label">
              <span class="label-text font-medium">Password</span>
            </span>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your password"
              class="input input-bordered w-full"
              required
            />
          </label>

          <p v-if="errorMessage" class="text-sm text-error">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            class="btn btn-primary w-full mt-2"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="loading loading-spinner loading-xs mr-1"
            ></span>
            {{ isSubmitting ? "Signing in..." : "Sign in" }}
          </button>

          <button
            type="button"
            class="btn btn-outline w-full"
            :disabled="isSubmitting"
            @click="handleGuestSignIn"
          >
            Guest Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const auth = useAuthStore();

const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  errorMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password.";
    return;
  }

  isSubmitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    auth.signedIn();
    await navigateTo("/library");
  } catch {
    errorMessage.value = "Something went wrong. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}

async function handleGuestSignIn() {
  errorMessage.value = "";
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    auth.signedIn();
    await navigateTo("/library");
  } catch {
    errorMessage.value = "Unable to sign in as guest. Please try again.";
  }
}
</script>
