export default {
  path: "/system",
  meta: {
    icon: "ep:setting",
    title: "系统管理",
    rank: 1
  },
  children: [
    {
      path: "/system/admin-list",
      name: "AdminList",
      component: () => import("@/views/system/admin-list.vue"),
      meta: {
        title: "管理员列表",
        showParent: true
      }
    },
    {
      path: "/system/config-list",
      name: "ConfigList",
      component: () => import("@/views/system/config-list.vue"),
      meta: {
        title: "系统参数管理",
        showParent: true
      }
    },
    {
      path: "/system/nutrition-list",
      name: "SystemNutritionList",
      component: () => import("@/views/system/nutrition-list.vue"),
      meta: {
        title: "营养元素管理",
        showParent: true
      }
    }
  ]
};
