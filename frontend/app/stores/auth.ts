import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const backend = useRuntimeConfig().public.backend;
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
    user.value = null;
  }

  async function saveRecents(recents: string[]) {
    const userId = user.value?.id;
    const token = tokenCookie.value;
    if(!userId || !token) {
      throw new Error("You must be signed in to save history");
    }
    return $fetch(`${backend}/users/${userId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { recents },
    });
  }

  interface Media {
  id: string;
  title: string;
  type: "image" | "video";
  tags: string[];
  path: string;
}

const media = ref<Media[]>([]);
const history = ref<unknown[]>([]);
const searchQuery = ref("");

const filteredMedia = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return media.value;
  }

  return media.value.filter((item) => {
    const tags = item.tags?.join(" ") ?? "";
    const searchable = `${item.title} ${item.type} ${tags}`.toLowerCase();
    return searchable.includes(query);
  });
});

async function fetchMedia() {
  media.value = await $fetch<Media[]>(`${backend}/medias`);
}

async function fetchHistory() {
      if (!isLoggedIn.value) {
        return;
      }
      
      history.value = await $fetch(`${backend}/users/${user.value.id}/history`, {
        headers: { Authorization: `Bearer ${tokenCookie.value}` },
      });
    }

return {
  signedIn,
  signIn,
  signUp,
  isLoggedIn,
  logout,
  user,
  media,
  filteredMedia,
  searchQuery,
  fetchMedia,
  saveRecents,
  fetchHistory,
  history,
};
});
