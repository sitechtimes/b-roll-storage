<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 bg-base-200/40"
  >
    <div class="card bg-base-100 w-full max-w-md shadow-sm">
      <div class="card-body p-8 md:p-10">
        <h1 class="text-3xl font-bold text-center text-base-content">
          Create Account
        </h1>

        <p class="text-sm text-base-content/70 text-center mt-1 mb-4">
          Create an account to upload your B-roll.
        </p>

        <form class="space-y-4 mt-1" @submit.prevent="handleSignup">
          <label class="form-control w-full">
            <span class="label">
              <span class="label-text font-medium">Name</span>
            </span>
            <input
              v-model.trim="name"
              type="text"
              autocomplete="name"
              placeholder="John Doe"
              class="input input-bordered w-full"
              required
            />
          </label>

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
              autocomplete="new-password"
              placeholder="At least 8 characters"
              minlength="8"
              maxlength="24"
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
            {{ isSubmitting ? "Creating account..." : "Create account" }}
          </button>

          <NuxtLink to="/login" class="btn btn-outline w-full">
            Back to login
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

const API_BASE = "http://localhost:3001";

async function handleSignup() {
  errorMessage.value = "";

  if (password.value.length < 8 || password.value.length > 24) {
    errorMessage.value = "Password must be between 8 and 24 characters.";
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });

    await navigateTo({
      path: "/verify",
      query: { email: email.value },
    });
  } catch (error: any) {
    errorMessage.value =
      error?.data?.error ||
      error?.data?.errors?.[0]?.message ||
      "Unable to create account.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>