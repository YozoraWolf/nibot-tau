import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: () => import("../views/Calendar.vue"),
  },
  {
    path: "/calendar/:date",
    name: "DatePage",
    component: () => import("../views/DatePage.vue"),
  },
  {
    path: "/today",
    name: "Today",
    component: () => import("../views/Today.vue"),
  },
  {
    path: "/connections",
    name: "Connections",
    component: () => import("../views/Connections.vue"),
  },
  {
    path: "/manual-post",
    name: "ManualPost",
    component: () => import("../views/ManualPost.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { routes, router };
