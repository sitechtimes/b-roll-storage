import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const authCookie = useCookie<boolean>("is_logged_in", {
    default: () => false,
    sameSite: "lax",
  });

  const isLoggedIn = ref<boolean>(Boolean(authCookie.value));

  function signedIn() {
    // simple check for both guest and sign in to just let you in
    isLoggedIn.value = true;
    authCookie.value = true;
  }

  function logout() {
    isLoggedIn.value = false;
    authCookie.value = false;
  }

  return {
    signedIn,
    isLoggedIn,
    logout,
  };
});
