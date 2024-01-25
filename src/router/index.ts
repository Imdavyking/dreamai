import { createRouter, createWebHistory } from "vue-router";
import Accounts from "@/views/accounts.vue";
import History from "@/views/history.vue";
import Home from "@/views/index.vue";
import { LayoutTypes } from "@/types/layouts";
import Login from "@/views/login.vue";
import Register from "@/views/register.vue";
import { useAuthStore } from "@/stores/auth";
import singleRunVue from "@/views/single-run.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        layout: LayoutTypes.Empty,
      },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        layout: LayoutTypes.Empty,
      },
    },
    {
      path: "/",
      name: "index",
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/accounts",
      name: "accounts",
      component: Accounts,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/history",
      name: "history",
      component: History,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/history/:id",
      name: "OneHistory",
      component: singleRunVue,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: "/login",
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    };
  }

  // if logged in redirect to index
  if ((to.name === "login" || to.name === "register") && authStore.isLoggedIn) {
    return {
      path: "/",
    };
  }
});

export default router;
const BASE_URL = import.meta.env.VITE_API_URL;
export { BASE_URL };
