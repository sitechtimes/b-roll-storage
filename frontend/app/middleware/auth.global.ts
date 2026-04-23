export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  if (to.path === "/login") {
    if (auth.isLoggedIn) {
      return navigateTo("/library");
    }
    return;
  }

  if (!auth.isLoggedIn) {
    return navigateTo("/login");
  }
});
