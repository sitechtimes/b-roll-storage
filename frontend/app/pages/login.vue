<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 bg-base-200/40"
  >
    <div class="card bg-base-100 w-full max-w-md shadow-sm">
      <div class="card-body p-8 md:p-10">
        <h1 class="text-3xl font-bold text-center text-base-content">Login</h1>
        <p class="text-sm text-base-content/70 text-center mt-1 mb-2">
          Sign in to access your B-roll library and uploads.
        </p>

        <form class="space-y-4" @submit.prevent="handleLogin">
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

          <div class="flex items-center justify-between text-sm pt-1">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="checkbox checkbox-sm"
              />
              <span class="label-text">Remember me</span>
            </label>
            <button type="button" class="link link-hover text-primary">
              Forgot password?
            </button>
          </div>

          <p v-if="errorMessage" class="text-sm text-error">
            {{ errorMessage }}
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
            {{ isSubmitting ? "Signing in..." : "Sign in" }}
          </button>
        </form>

        <div class="divider my-3">OR</div>

        <button
          class="btn btn-outline w-full"
          type="button"
          @click="useDemoLogin"
        >
          Use demo login
        </button>

        <p class="text-sm text-center text-base-content/70 mt-3">
          Need access?
          <span class="text-primary font-medium">Contact your admin.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

const DEMO_EMAIL = "jarvisl5@nycstudents.net";

function useDemoLogin() {
  email.value = DEMO_EMAIL;
  password.value = "";
  errorMessage.value = "";
}

async function handleLogin() {
  errorMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password.";
    return;
  }

  isSubmitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Login submit payload (temporary):", {
      email: email.value,
      passwordLength: password.value.length,
      rememberMe: rememberMe.value,
    });
  } catch {
    errorMessage.value = "Something went wrong. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
