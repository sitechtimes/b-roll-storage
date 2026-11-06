import { defineStore } from "pinia";
import { ref } from "vue";

export const useVerifyStore = defineStore("verify", () => {
  interface VerifyResponse {
    message: string;
    error?: string;
    verified?: boolean;
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

      if (response.verified) {
        errorMessage.value = "This account is already verified";
        return;
      }

      message.value = response.message;
    } catch (error: any) {
      errorMessage.value =
        error?.data?.error === "INVALID_CREDENTIALS"
          ? "Account does not exist"
          : "An error occurred while sending verification email";
    } finally {
      isSending.value = false;
    }
  }
  return { email, isSending, message, errorMessage, sendVerification };
  });