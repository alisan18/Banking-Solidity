const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
  },

  {
    path: "/admin",
    component: () => import("pages/AdminPage.vue"),
    children: [
      { path: "/users", component: () => import("pages/UserPage.vue") },
      { path: "/multi-sig", component: () => import("pages/MultiSigPage.vue") },
      { path: "/vault", component: () => import("pages/VaultPage.vue") },
      { path: "/others", component: () => import("pages/OthersPage.vue") },
    ],
  },
  {
    path: "/client",
    component: () => import("pages/clientPage.vue"),
    children: [
      {
        path: "/client/account",
        component: () => import("pages/AccountPage.vue"),
      },
      {
        path: "/client/deposit",
        component: () => import("pages/DepositPage.vue"),
      },
      {
        path: "/client/withdraw",
        component: () => import("pages/WithdrawPage.vue"),
      },
      {
        path: "/client/transfer",
        component: () => import("pages/TransferPage.vue"),
      },
      {
        path: "/client/exchange",
        component: () => import("pages/ExchangePage.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
