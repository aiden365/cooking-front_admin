// 最简代码，也就是这些字段必须有
export default {
  path: "/dish",
  meta: {
    icon: "ep:notebook",
    title: "菜谱管理",
    rank: 1
  },
  children: [
    {
      path: "/dish/list",
      name: "DishList",
      component: () => import("@/views/dish/list.vue"),
      meta: {
        title: "菜谱列表",
        showParent: true
      }
    },
    {
      path: "/dish/save",
      name: "DishSave",
      component: () => import("@/views/dish/save.vue"),
      meta: {
        title: "新增菜谱",
        showLink: false,
        activePath: "/dish/list"
      }
    },
    {
      path: "/dish/save/:id",
      name: "DishSave",
      component: () => import("@/views/dish/save.vue"),
      meta: {
        title: "编辑菜谱",
        showLink: false,
        activePath: "/dish/list"
      }
    },
    {
      path: "/dish/detail/:id",
      name: "DishDetail",
      component: () => import("@/views/dish/detail.vue"),
      meta: {
        title: "菜谱详情",
        showLink: false,
        activePath: "/dish/list"
      }
    },
    {
      path: "/dish/appraise-list",
      name: "DishAppraiseList",
      component: () => import("@/views/dish/appraise-list.vue"),
      meta: {
        title: "菜谱评价",
        showParent: true
      }
    }
  ]
};
