import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("../views/Auth/Login.vue"),
    meta: { noAuth: true },
  },
  {
    path: "/auth/register",
    name: "register",
    component: () => import("../views/Auth/Register.vue"),
    meta: { noAuth: true },
  },
  {
    path: "/games",
    name: "games",
    component: () => import("../views/Games/Index.vue"),
  },
  {
    path: "/games/owned",
    name: "games.owned",
    component: () => import("../views/Games/Owned.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/games/liked",
    name: "games.liked",
    component: () => import("../views/Games/Liked.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/games/add",
    name: "games.add",
    component: () => import("../views/Games/Add.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/games/search/:term",
    name: "games.search",
    component: () => import("../views/Games/Search.vue"),
  },
  {
    path: "/games/:id/edit",
    name: "games.edit",
    component: () => import("../views/Games/Edit.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/games/:id",
    name: "games.show",
    component: () => import("../views/Games/Show.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((item) => item.meta.requiresAuth);
  const noAuth = to.matched.some((item) => item.meta.noAuth);

  if (
    (authRequired && store.state.token === null) ||
    (noAuth && store.state.token !== null)
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
