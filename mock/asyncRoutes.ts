// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

const dishRouter = {
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
      component: "dish/list",
      meta: {
        title: "菜谱列表",
        showParent: true
      }
    },
    {
      path: "/dish/add",
      name: "DishAdd",
      component: "dish/add",
      meta: {
        title: "新增菜谱",
        showLink: false,
        activePath: "/dish/list"
      }
    },
    {
      path: "/dish/edit/:id",
      name: "DishEdit",
      component: "dish/edit",
      meta: {
        title: "编辑菜谱",
        showLink: false,
        activePath: "/dish/list"
      }
    },
    {
      path: "/dish/detail/:id",
      name: "DishDetail",
      component: "dish/detail",
      meta: {
        title: "菜谱详情",
        showLink: false,
        activePath: "/dish/list"
      }
    },
    {
      path: "/dish/appraise-list",
      name: "DishAppraiseList",
      component: "dish/appraise-list",
      meta: {
        title: "菜谱评价",
        showParent: true
      }
    }
  ]
};

const userRouter = {
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
      component: "user/user-list",
      meta: {
        title: "用户列表",
        showParent: true
      }
    },
    {
      path: "/user/add",
      name: "UserAdd",
      component: "user/edit",
      meta: {
        title: "新增用户",
        showLink: false,
        activePath: "/user/list"
      }
    },
    {
      path: "/user/edit/:id",
      name: "UserEdit",
      component: "user/edit",
      meta: {
        title: "编辑用户",
        showLink: false,
        activePath: "/user/list"
      }
    },
    {
      path: "/user/share-list",
      name: "UserShareList",
      component: "user/share-list",
      meta: {
        title: "用户分享",
        showParent: true
      }
    },
    {
      path: "/user/diet-list",
      name: "UserDietList",
      component: "user/diet-list",
      meta: {
        title: "饮食管理",
        showParent: true
      }
    },
    {
      path: "/user/nutrition-list",
      name: "UserNutritionList",
      component: "user/nutrition-list",
      meta: {
        title: "营养管理",
        showParent: true
      }
    }
  ]
};

const lableRouter = {
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
      component: "lable/dish-lable-list",
      meta: {
        title: "菜谱标签",
        showParent: true
      }
    },
    {
      path: "/lable/user-list",
      name: "UserLableList",
      component: "lable/user-lable-list",
      meta: {
        title: "用户标签",
        showParent: true
      }
    }
  ]
};

const repositoryRouter = {
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
      component: "repository/list",
      meta: {
        title: "知识列表",
        showParent: true
      }
    },
    {
      path: "/repository/add",
      name: "RepositoryAdd",
      component: "repository/edit",
      meta: {
        title: "新增知识",
        showLink: false,
        activePath: "/repository/list"
      }
    },
    {
      path: "/repository/edit/:id",
      name: "RepositoryEdit",
      component: "repository/edit",
      meta: {
        title: "编辑知识",
        showLink: false,
        activePath: "/repository/list"
      }
    }
  ]
};

const systemRouter = {
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
      component: "system/admin-list",
      meta: {
        title: "管理员列表",
        showParent: true
      }
    },
    {
      path: "/system/config-list",
      name: "ConfigList",
      component: "system/config-list",
      meta: {
        title: "系统参数管理",
        showParent: true
      }
    },
    {
      path: "/system/nutrition-list",
      name: "SystemNutritionList",
      component: "system/nutrition-list",
      meta: {
        title: "营养元素管理",
        showParent: true
      }
    }
  ]
};

const fightingRouter = {
  path: "/fighting",
  meta: {
    icon: "ri:bookmark-2-line",
    title: "励志",
    rank: 99
  },
  name: "励志2",
  children: [
    {
      path: "/fighting/index1",
      name: "Fighting",
      meta: {
        title: "加油",
        showParent: true
      }
    },
    {
      path: "/fighting/index2",
      name: "Effort",
      meta: {
        title: "努力",
        showParent: true
      }
    },
    {
      path: "/fighting/ep",
      name: "FrameEp",
      meta: {
        title: "饿了么UI",
        frameSrc: "https://element-plus.org/zh-CN/",
        keepAlive: true,
        roles: ["admin", "common"]
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          dishRouter,
          userRouter,
          lableRouter,
          repositoryRouter,
          systemRouter
        ]
      };
    }
  }
]);
