// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */
const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "ep:lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "路由返回按钮权限",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "登录接口返回按钮权限"
          }
        }
      ]
    }
  ]
};

const dishRouter = {
  path: "/dish",
  meta: {
    icon: "ri:bookmark-2-line",
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
    icon: "ri:bookmark-2-line",
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
    icon: "ri:bookmark-2-line",
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
    icon: "ri:bookmark-2-line",
    title: "系统管理",
    rank: 1
  },
  children: [
    {
      path: "/system/admin-list",
      name: "AdminList",
      meta: {
        title: "管理员列表",
        showParent: true
      }
    },
    {
      path: "/system/config-list",
      name: "ConfigList",
      meta: {
        title: "参数配置",
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
          permissionRouter,
          dishRouter,
          userRouter,
          lableRouter,
          repositoryRouter,
          systemRouter,
          fightingRouter
        ]
      };
    }
  }
]);
