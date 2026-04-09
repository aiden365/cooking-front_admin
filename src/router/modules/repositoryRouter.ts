export default {
  path: "/repository",
  meta: {
    icon: "ep:opportunity",
    title: "知识管理",
    rank: 1
  },
  children: [
    {
      path: "/repository/list",
      name: "RepositoryList",
      component: () => import("@/views/repository/list.vue"),
      meta: {
        title: "知识列表",
        showParent: true
      }
    },
    {
      path: "/repository/add",
      name: "RepositoryAdd",
      component: () => import("@/views/repository/edit.vue"),
      meta: {
        title: "新增知识",
        showLink: false,
        activePath: "/repository/list"
      }
    },
    {
      path: "/repository/edit/:id",
      name: "RepositoryEdit",
      component: () => import("@/views/repository/edit.vue"),
      meta: {
        title: "编辑知识",
        showLink: false,
        activePath: "/repository/list"
      }
    }
  ]
};
