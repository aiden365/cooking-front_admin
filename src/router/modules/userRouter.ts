export default {
  path: "/user",
  meta: {
    icon: "ep:user-filled",
    title: "用户管理",
    rank: 1
  },
  children: [
    {
      path: "/user/list",
      name: "UserList",
      component: () => import("@/views/user/user-list.vue"),
      meta: {
        title: "用户列表",
        showParent: true
      }
    },
    {
      path: "/user/save",
      name: "UserSave",
      component: () => import("@/views/user/save.vue"),
      meta: {
        title: "新增用户",
        showLink: false,
        activePath: "/user/list"
      }
    },
    {
      path: "/user/save/:id",
      name: "UserSave",
      component: () => import("@/views/user/save.vue"),
      meta: {
        title: "编辑用户",
        showLink: false,
        activePath: "/user/list"
      }
    },
    {
      path: "/user/share-list",
      name: "UserShareList",
      component: () => import("@/views/user/share-list.vue"),
      meta: {
        title: "用户分享",
        showParent: true
      }
    },
    {
      path: "/user/diet-list",
      name: "UserDietList",
      component: () => import("@/views/user/diet-list.vue"),
      meta: {
        title: "饮食管理",
        showParent: true
      }
    },
    {
      path: "/user/nutrition-list",
      name: "UserNutritionList",
      component: () => import("@/views/user/nutrition-list.vue"),
      meta: {
        title: "营养管理",
        showParent: true
      }
    }
  ]
};
