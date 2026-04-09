export default {
  path: "/lable",
  meta: {
    icon: "ri:bookmark-2-line",
    title: "标签管理",
    rank: 1
  },
  children: [
    {
      path: "/lable/dish-list",
      name: "DishLableList",
      component: () => import("@/views/dish/dish-lable-list.vue"),
      meta: {
        title: "菜谱标签",
        showParent: true
      }
    },
    {
      path: "/lable/user-list",
      name: "UserLableList",
      component: () => import("@/views/dish/user-lable-list.vue"),
      meta: {
        title: "用户标签",
        showParent: true
      }
    }
  ]
};
