const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
  },

  {
    path: "/home",
    component: () => import("pages/AdminPage.vue"),
    children: [
      { path: "/users", component: () => import("pages/UserPage.vue") },
      { path: "/multi-sig", component: () => import("pages/MultiSigPage.vue") },
      { path: "/vault", component: () => import("pages/VaultPage.vue") },
      { path: "/others", component: () => import("pages/OthersPage.vue") },
    ],
  },
  // {
  //   path: "/user",
  //   component: () => import("pages/UserPage.vue"),
  // },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
