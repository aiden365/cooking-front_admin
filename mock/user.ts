import { defineFakeRoute } from "vite-plugin-fake-server/client";

interface UserItem {
  id: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  height: number;
  weight: number;
  status: 1 | 3;
  registerTime: string;
}

interface UserShareItem {
  id: number;
  username: string;
  recipeName: string;
  description: string;
  imageName: string;
  imageUrl: string;
}

interface UserDietItem {
  id: number;
  username: string;
  recipeName: string;
  date: string;
  mealTime: 1 | 2 | 3;
}

interface UserNutritionTargetItem {
  id: number;
  nutritionName: string;
  targetValue: string;
}

interface UserNutritionItem {
  id: number;
  username: string;
  nutritionCount: number;
  gender: "男" | "女";
  age: number;
  height: number;
  weight: number;
  targets: UserNutritionTargetItem[];
}

interface UserSaveBody {
  id?: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  height: number;
  weight: number;
  status: 1 | 3;
}

interface NutritionSaveBody {
  id: number;
  nutritionName: string;
  targetValue: string;
}

type SystemConfigKey =
  | "aiModel"
  | "maxUserLabels"
  | "maxDishLabels"
  | "nutritionNames"
  | "maxNutritionTargets";

interface AiModelConfig {
  ApiUrl: string;
  ApiKey: string;
}

interface SystemConfigCardItem {
  key: SystemConfigKey;
  name: string;
  description: string;
}

interface SaveSystemConfigBody {
  key: SystemConfigKey;
  aiModelConfig?: AiModelConfig;
  maxCount?: number;
  nutritionNames?: string[];
}

interface AdminItem {
  id: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  status: 1 | 2 | 3;
  registerTime: string;
}

interface AdminSaveBody {
  id?: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  status: 1 | 2 | 3;
}

const nutritionNames = ["蛋白质", "脂肪", "碳水化合物"];
const userNames = [
  "王小满",
  "李晓彤",
  "陈一诺",
  "赵安安",
  "刘晨",
  "孙嘉禾",
  "周知许",
  "吴可可",
  "郑雨桐",
  "何书言",
  "Mia",
  "Tom"
];

const recipeNames = [
  "宫保鸡丁",
  "番茄牛腩",
  "清蒸鲈鱼",
  "蒜蓉西兰花",
  "黑椒鸡胸肉",
  "菌菇豆腐煲"
];

const userList: UserItem[] = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  username: userNames[index % userNames.length],
  account: `user_${String(index + 1).padStart(3, "0")}`,
  age: 20 + (index % 15),
  gender: index % 2 === 0 ? "女" : "男",
  height: 158 + (index % 18),
  weight: 45 + (index % 20),
  status: index % 5 === 0 ? 3 : 1,
  registerTime: `2026-02-${String((index % 28) + 1).padStart(2, "0")} 10:${String(index % 60).padStart(2, "0")}:00`
}));

const userShares: UserShareItem[] = Array.from({ length: 24 }, (_, index) => {
  const id = index + 1;
  const timestamp = 1741708800000 + index * 3600 * 1000;
  return {
    id,
    username: userNames[index % userNames.length],
    recipeName: recipeNames[index % recipeNames.length],
    description:
      "这道菜整体口味不错，步骤也比较清晰，适合日常家庭制作。我根据自己的口味做了少量调整。",
    imageName: `${timestamp}.jpg`,
    imageUrl: `https://picsum.photos/seed/user-share-${id}/320/220`
  };
});

const userDiets: UserDietItem[] = Array.from({ length: 28 }, (_, index) => ({
  id: index + 1,
  username: userNames[index % userNames.length],
  recipeName: recipeNames[index % recipeNames.length],
  date: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
  mealTime: ((index % 3) + 1) as 1 | 2 | 3
}));

const userNutritionList: UserNutritionItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  username: userNames[index % userNames.length],
  nutritionCount: nutritionNames.length,
  gender: index % 2 === 0 ? "女" : "男",
  age: 22 + (index % 12),
  height: 160 + (index % 15),
  weight: 48 + (index % 18),
  targets: nutritionNames.map((name, targetIndex) => ({
    id: (index + 1) * 10 + targetIndex + 1,
    nutritionName: name,
    targetValue: `${20 + index + targetIndex * 5}g`
  }))
}));

const systemConfigCards: SystemConfigCardItem[] = [
  {
    key: "aiModel",
    name: "AI大模型配置",
    description: "维护 AI 大模型调用地址和访问密钥。"
  },
  {
    key: "maxUserLabels",
    name: "用户标签最大数量",
    description: "限制单个用户可绑定的标签数量上限。"
  },
  {
    key: "maxDishLabels",
    name: "菜品标签最大数量",
    description: "限制单个菜品可绑定的标签数量上限。"
  },
  {
    key: "nutritionNames",
    name: "营养参数配置",
    description: "维护营养参数名称列表，支持动态新增和删除。"
  },
  {
    key: "maxNutritionTargets",
    name: "营养目标最大数量",
    description: "限制单个用户可配置的营养目标数量上限。"
  }
];

const systemConfigStore = {
  aiModelConfig: {
    ApiUrl: "http://localhost:11434",
    ApiKey: "8eb8e487cf3c44e5ac44ce81ee67f6a3"
  },
  maxUserLabels: 6,
  maxDishLabels: 8,
  nutritionNames: [...nutritionNames],
  maxNutritionTargets: 3
};

const adminNames = [
  "系统管理员",
  "运营主管",
  "内容审核员",
  "平台维护员",
  "营养配置员",
  "超级管理员",
  "测试管理员"
];

const adminList: AdminItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  username: adminNames[index % adminNames.length],
  account: `admin_${String(index + 1).padStart(3, "0")}`,
  age: 24 + (index % 10),
  gender: index % 2 === 0 ? "男" : "女",
  status: ([1, 2, 3] as const)[index % 3],
  registerTime: `2026-01-${String((index % 28) + 1).padStart(2, "0")} 09:${String((index * 7) % 60).padStart(2, "0")}:00`
}));

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default defineFakeRoute([
  {
    url: "/system/user/list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const keyword = String(query?.keyword ?? "").trim();

      const filteredList = userList.filter(item =>
        keyword ? item.username.includes(keyword) : true
      );
      const startIndex = (pageNum - 1) * pageSize;
      const list = filteredList.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        code: 200,
        data: {
          list,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/user/share-list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const username = String(query?.username ?? "").trim();
      const recipeName = String(query?.recipeName ?? "").trim();

      const filteredList = userShares.filter(item => {
        const matchesUser = username ? item.username.includes(username) : true;
        const matchesRecipe = recipeName ? item.recipeName.includes(recipeName) : true;
        return matchesUser && matchesRecipe;
      });
      const startIndex = (pageNum - 1) * pageSize;
      const list = filteredList.slice(startIndex, startIndex + pageSize).map(item => ({
        id: item.id,
        username: item.username,
        recipeName: item.recipeName,
        description: item.description,
        imageName: item.imageName
      }));

      return {
        success: true,
        code: 200,
        data: {
          list,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/user/diet-list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const username = String(query?.username ?? "").trim();
      const recipeName = String(query?.recipeName ?? "").trim();
      const date = String(query?.date ?? "").trim();
      const mealTime = Number(query?.mealTime || 0);

      const filteredList = userDiets.filter(item => {
        const matchesUser = username ? item.username.includes(username) : true;
        const matchesRecipe = recipeName ? item.recipeName.includes(recipeName) : true;
        const matchesDate = date ? item.date === date : true;
        const matchesMealTime = mealTime ? item.mealTime === mealTime : true;
        return matchesUser && matchesRecipe && matchesDate && matchesMealTime;
      });
      const startIndex = (pageNum - 1) * pageSize;
      const list = filteredList.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        code: 200,
        data: {
          list,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/user/nutrition-list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const username = String(query?.username ?? "").trim();

      const filteredList = userNutritionList.filter(item =>
        username ? item.username.includes(username) : true
      );
      const startIndex = (pageNum - 1) * pageSize;
      const list = filteredList.slice(startIndex, startIndex + pageSize).map(item => ({
        id: item.id,
        username: item.username,
        nutritionCount: item.nutritionCount,
        gender: item.gender,
        age: item.age,
        height: item.height,
        weight: item.weight
      }));

      return {
        success: true,
        code: 200,
        data: {
          list,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/user/nutrition-targets",
    method: "get",
    response: ({ query }) => {
      const userId = Number(query?.userId);
      const user = userNutritionList.find(item => item.id === userId) ?? userNutritionList[0];
      return {
        success: true,
        code: 200,
        data: {
          username: user.username,
          list: user.targets
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/config/nutrition-names",
    method: "get",
    response: () => {
      return {
        success: true,
        code: 200,
        data: systemConfigStore.nutritionNames,
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/config/list",
    method: "get",
    response: () => {
      return {
        success: true,
        code: 200,
        data: systemConfigCards,
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/config/detail",
    method: "get",
    response: ({ query }) => {
      const key = String(query?.key ?? "") as SystemConfigKey;
      const card = systemConfigCards.find(item => item.key === key) ?? systemConfigCards[0];

      if (key === "aiModel") {
        return {
          success: true,
          code: 200,
          data: {
            ...card,
            aiModelConfig: systemConfigStore.aiModelConfig
          },
          message: "请求成功"
        };
      }

      if (key === "nutritionNames") {
        return {
          success: true,
          code: 200,
          data: {
            ...card,
            nutritionNames: systemConfigStore.nutritionNames
          },
          message: "请求成功"
        };
      }

      return {
        success: true,
        code: 200,
        data: {
          ...card,
          maxCount: systemConfigStore[key]
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/config/save",
    method: "post",
    response: ({ body }) => {
      const payload = body as SaveSystemConfigBody;
      if (payload.key === "aiModel" && payload.aiModelConfig) {
        systemConfigStore.aiModelConfig = { ...payload.aiModelConfig };
      }

      if (
        (payload.key === "maxUserLabels" ||
          payload.key === "maxDishLabels" ||
          payload.key === "maxNutritionTargets") &&
        typeof payload.maxCount === "number"
      ) {
        systemConfigStore[payload.key] = payload.maxCount;
      }

      if (payload.key === "nutritionNames" && payload.nutritionNames) {
        systemConfigStore.nutritionNames = payload.nutritionNames.filter(Boolean);
      }

      return {
        success: true,
        code: 200,
        data: null,
        message: "保存成功"
      };
    }
  },
  {
    url: "/system/admin/list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const username = String(query?.username ?? "").trim();
      const status = Number(query?.status || 0);

      const filteredList = adminList.filter(item => {
        const matchesUsername = username ? item.username.includes(username) : true;
        const matchesStatus = status ? item.status === status : true;
        return matchesUsername && matchesStatus;
      });
      const startIndex = (pageNum - 1) * pageSize;
      const list = filteredList.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        code: 200,
        data: {
          list,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/admin/detail",
    method: "get",
    response: ({ query }) => {
      const adminId = Number(query?.adminId);
      const admin = adminList.find(item => item.id === adminId) ?? adminList[0];
      const { registerTime: _registerTime, ...detail } = admin;
      return {
        success: true,
        code: 200,
        data: detail,
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/admin/save",
    method: "post",
    response: ({ body }) => {
      const payload = body as AdminSaveBody;
      if (payload.id) {
        const target = adminList.find(item => item.id === payload.id);
        if (target) {
          target.username = payload.username;
          target.account = payload.account;
          target.age = payload.age;
          target.gender = payload.gender;
          target.status = payload.status;
        }
      } else {
        const nextId = adminList.length > 0 ? Math.max(...adminList.map(item => item.id)) + 1 : 1;
        adminList.unshift({
          id: nextId,
          username: payload.username,
          account: payload.account,
          age: payload.age,
          gender: payload.gender,
          status: payload.status,
          registerTime: new Date().toISOString().slice(0, 19).replace("T", " ")
        });
      }
      return {
        success: true,
        code: 200,
        data: null,
        message: "保存成功"
      };
    }
  },
  {
    url: "/system/admin/reset-password",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "密码修改成功"
      };
    }
  },
  {
    url: "/system/admin/update-status",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "状态更新成功"
      };
    }
  },
  {
    url: "/system/user/nutrition-target/save",
    method: "post",
    response: ({ body }) => {
      const payload = body as NutritionSaveBody;
      for (const user of userNutritionList) {
        const target = user.targets.find(item => item.id === payload.id);
        if (target) {
          target.nutritionName = payload.nutritionName;
          target.targetValue = payload.targetValue;
          break;
        }
      }
      return {
        success: true,
        code: 200,
        data: null,
        message: "保存成功"
      };
    }
  },
  {
    url: "/system/user/nutrition-target/delete",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      for (const user of userNutritionList) {
        const index = user.targets.findIndex(item => item.id === id);
        if (index >= 0) {
          user.targets.splice(index, 1);
          user.nutritionCount = user.targets.length;
          break;
        }
      }
      return {
        success: true,
        code: 200,
        data: null,
        message: "删除成功"
      };
    }
  },
  {
    url: "/system/user/share-detail",
    method: "get",
    response: ({ query }) => {
      const shareId = Number(query?.shareId);
      const share = userShares.find(item => item.id === shareId) ?? userShares[0];
      return {
        success: true,
        code: 200,
        data: share,
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/user/share-delete",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "删除成功"
      };
    }
  },
  {
    url: "/system/user/diet-delete",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "删除成功"
      };
    }
  },
  {
    url: "/system/user/detail",
    method: "get",
    response: ({ query }) => {
      const userId = Number(query?.userId);
      const user = userList.find(item => item.id === userId) ?? userList[0];
      const { registerTime: _registerTime, ...detail } = user;
      return {
        success: true,
        code: 200,
        data: detail,
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/user/save",
    method: "post",
    response: ({ body }) => {
      const payload = body as UserSaveBody;
      if (payload.id) {
        const target = userList.find(item => item.id === payload.id);
        if (target) {
          target.username = payload.username;
          target.account = payload.account;
          target.age = payload.age;
          target.gender = payload.gender;
          target.height = payload.height;
          target.weight = payload.weight;
          target.status = payload.status;
        }
      } else {
        const nextId = userList.length > 0 ? Math.max(...userList.map(item => item.id)) + 1 : 1;
        userList.unshift({
          id: nextId,
          username: payload.username,
          account: payload.account,
          age: payload.age,
          gender: payload.gender,
          height: payload.height,
          weight: payload.weight,
          status: payload.status,
          registerTime: new Date().toISOString().slice(0, 19).replace("T", " ")
        });
      }
      return {
        success: true,
        code: 200,
        data: null,
        message: "保存成功"
      };
    }
  },
  {
    url: "/system/user/reset-password",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "密码修改成功"
      };
    }
  },
  {
    url: "/system/user/update-status",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "状态更新成功"
      };
    }
  }
]);
