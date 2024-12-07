import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/date/:date",
    name: "DatePage",
    component: () => import("../views/DatePage.vue"),
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { routes, router };
