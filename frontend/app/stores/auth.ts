import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
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
  const authCookie = useCookie<boolean>("is_logged_in", {
    default: () => false,
    sameSite: "lax",
  });
  const tokenCookie = useCookie<string | null>("auth_token", {
    default: () => null,
  });
  const userIdCookie = useCookie<string | null>("user_id", {
    default: () => null,
  });
  const token = computed(() => tokenCookie.value);
  const userId = computed(() => userIdCookie.value);
  const isLoggedIn = ref<boolean>(Boolean(authCookie.value));
  const user = ref<any>(null);
  function signedIn(userData: any, token: string) {
    // simple check for both guest and sign in to just let you in
    isLoggedIn.value = true;
    authCookie.value = true;
    tokenCookie.value = token;
    user.value = userData;
    userIdCookie.value = userData.id ?? null;
  }

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
  return { email, isSending, message, errorMessage, sendVerification, signedIn, signIn, signUp, isLoggedIn, token, userId, logout, user };
  
  async function signIn(email: string, password: string) {
    const response = await $fetch<{
      token?: string;
      [key: string]: unknown;
    }>(`${backend}/auth/signin`, {
      method: "POST",
      body: { email, password },
    });

    if (!response.token) {
      throw new Error("The server did not return a login token.");
    }

    signedIn(response, response.token);
  }

  function signUp(name: string, email: string, password: string) {
    return $fetch<{ message: string }>(`${backend}/auth/signup`, {
      method: "POST",
      body: { name, email, password },
    });
  }

  function logout() {
    isLoggedIn.value = false;
    authCookie.value = false;
    tokenCookie.value = null;
    userIdCookie.value = null;
    user.value = null;
  }

return {
  signedIn,
  signIn,
  signUp,
  isLoggedIn,
  token,
  userId,
  logout,
  user,
  email,
  isSending,
  message,
  errorMessage,
  sendVerification,
};
});
