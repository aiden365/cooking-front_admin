export default {
  path: "/label",
  meta: {
    icon: "ri:bookmark-2-line",
    title: "标签管理",
    rank: 1
  },
  children: [
    {
      path: "/label/dish-list",
      name: "DishLabelList",
      component: () => import("@/views/label/dish-label-list.vue"),
      meta: {
        title: "菜谱标签",
        showParent: true
      }
    },
    {
      path: "/label/user-list",
      name: "UserLabelList",
      component: () => import("@/views/label/user-label-list.vue"),
      meta: {
        title: "用户标签",
        showParent: true
      }
    }
  ]
};
