import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const authCookie = useCookie<boolean>("is_logged_in", {
    default: () => false,
    sameSite: "lax",
  });
  const tokenCookie = useCookie<string | null>("auth_token", {
    default: () => null,
  });
  const isLoggedIn = ref<boolean>(Boolean(authCookie.value));
  const user = ref<any>(null);
  function signedIn(userData: any, token: string) {
    // simple check for both guest and sign in to just let you in
    isLoggedIn.value = true;
    authCookie.value = true;
    tokenCookie.value = token;
    user.value = userData;
  }

  function logout() {
    isLoggedIn.value = false;
    authCookie.value = false;
    tokenCookie.value = null;
    user.value = null;
  }

  return {
    signedIn,
    isLoggedIn,
    logout,
    user,
  };
});
