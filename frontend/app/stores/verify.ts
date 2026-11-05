import { defineStore } from "pinia";
import { ref } from "vue";

export const useVerifyStore = defineStore("verify", () => {
  interface VerifyResponse {
    message: string;
    error?: string;

  }

  const backend = useRuntimeConfig().public.backend;
  const email = ref("");
  const isSending = ref(false);
  const message = ref("");
  const errorMessage = ref("");

  async function sendVerification() {
    message.value = "";
    errorMessage.value = "";
    if (!email.value.trim()) {
      errorMessage.value = "Enter your email";
      return;
    }

    isSending.value = true;
    try {
      const response = await $fetch<VerifyResponse>(`${backend}/auth/verify`, {
        method: "POST",
        body: {
          email: email.value.trim(),
          newToken: true,
        },
      });
      message.value = response.message;
    } catch (error) {
      errorMessage.value = "An error occurred while sending verification email";
    } finally {
      isSending.value = false;
    }
  }
  return { email, isSending, message, errorMessage, sendVerification };
  });