import { defineStore } from "pinia";
// go over with jarvis later to see if its fine or if backend handles it alr?
// yea this needs to be implemented with bakend call to user to check role
// guest mode needs authcookie thing, write tmrw and see if fix

export const useAuthStore = defineStore("auth", () => {
  const authCookie = useCookie<boolean>("is_logged_in", {
    default: () => false,
    sameSite: "lax",
  });

  const isLoggedIn = ref<boolean>(Boolean(authCookie.value));
  const guestMode = ref<boolean>(false);

  function login() {
    isLoggedIn.value = true;
    authCookie.value = true;
    return (guestMode.value = false);
  }

  function guestLogin() {
    isLoggedIn.value = true;
    authCookie.value = true;
    return (guestMode.value = true);
  }

  function logout() {
    isLoggedIn.value = false;
    authCookie.value = false;
  }

  return {
    guestMode,
    isLoggedIn,
    login,
    guestLogin,
    logout,
  };
});
