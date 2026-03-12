import { defineFakeRoute } from "vite-plugin-fake-server/client";

type RecipeVerifyStatus = 1 | 2;

interface RecipeSeasoningItem {
  id: number;
  name: string;
  dosage: string;
}

interface RecipeIngredientItem {
  id: number;
  name: string;
  dosage: string;
  preparation: string;
}

interface RecipeStepItem {
  id: number;
  order: number;
  description: string;
  sampleImage: string;
}

interface RecipeAppraiseUserItem {
  id: number;
  username: string;
  operationScore: number;
  matchingScore: number;
  satisfactionScore: number;
}

interface RecipeItem {
  id: number;
  name: string;
  cover: string;
  ingredientCount: number;
  seasoningCount: number;
  stepCount: number;
  durationMinutes: number;
  viewCount: number;
  activityValue: number;
  popularityValue: number;
  comprehensiveScore: number;
  verifyStatus: RecipeVerifyStatus;
  tags: string[];
  createdAt: string;
  tips: string;
  seasonings: RecipeSeasoningItem[];
  ingredients: RecipeIngredientItem[];
  steps: RecipeStepItem[];
  appraises: RecipeAppraiseUserItem[];
}

interface CreateRecipeBody {
  name: string;
  durationMinutes: number;
  tips: string;
  cover: string;
  seasonings: Array<{
    name: string;
    dosage: string;
  }>;
  ingredients: Array<{
    name: string;
    dosage: string;
    preparation: string;
  }>;
  steps: Array<{
    order: number;
    description: string;
    sampleImage: string;
  }>;
}

const recipeNamePool = [
  "宫保鸡丁",
  "番茄牛腩",
  "清蒸鲈鱼",
  "蒜蓉西兰花",
  "黑椒鸡胸肉",
  "酸辣土豆丝",
  "菌菇豆腐煲",
  "红烧排骨",
  "香煎三文鱼",
  "虾仁滑蛋",
  "上汤娃娃菜",
  "照烧鸡腿饭"
];

const userPool = ["小王", "小李", "阿青", "Tom", "Lucy", "Mia"];

function buildSeasonings(seed: number): RecipeSeasoningItem[] {
  return [
    { id: seed * 10 + 1, name: "生抽", dosage: "1 勺" },
    { id: seed * 10 + 2, name: "食盐", dosage: "2 克" },
    { id: seed * 10 + 3, name: "黑胡椒", dosage: "1 克" }
  ];
}

function buildIngredients(seed: number): RecipeIngredientItem[] {
  return [
    {
      id: seed * 10 + 1,
      name: "鸡胸肉",
      dosage: "200 克",
      preparation: "切丁后加入少量盐抓匀腌制"
    },
    {
      id: seed * 10 + 2,
      name: "彩椒",
      dosage: "80 克",
      preparation: "切块备用"
    },
    {
      id: seed * 10 + 3,
      name: "洋葱",
      dosage: "60 克",
      preparation: "切丝备用"
    }
  ];
}

function buildSteps(seed: number): RecipeStepItem[] {
  return [
    {
      id: seed * 10 + 1,
      order: 1,
      description: "锅中热油，先将主食材翻炒至微微变色，保持中火避免口感过老。",
      sampleImage: `https://picsum.photos/seed/recipe-step-${seed}-1/120/80`
    },
    {
      id: seed * 10 + 2,
      order: 2,
      description: "加入配菜和调料继续翻炒，确保食材均匀裹上汤汁并充分入味。",
      sampleImage: `https://picsum.photos/seed/recipe-step-${seed}-2/120/80`
    },
    {
      id: seed * 10 + 3,
      order: 3,
      description: "出锅前根据口味再次调整调味，翻匀后装盘即可。",
      sampleImage: `https://picsum.photos/seed/recipe-step-${seed}-3/120/80`
    }
  ];
}

function buildAppraises(seed: number): RecipeAppraiseUserItem[] {
  return Array.from({ length: 4 }, (_, index) => ({
    id: seed * 10 + index + 1,
    username: userPool[(seed + index) % userPool.length],
    operationScore: Number((1.2 + ((seed + index) % 30) / 10).toFixed(1)),
    matchingScore: Number((1.4 + ((seed + index * 2) % 28) / 10).toFixed(1)),
    satisfactionScore: Number((1.6 + ((seed + index * 3) % 26) / 10).toFixed(1))
  }));
}

const recipeList: RecipeItem[] = Array.from({ length: 60 }, (_, index) => {
  const id = index + 1;
  const name = `${recipeNamePool[index % recipeNamePool.length]}`;
  const seasonings = buildSeasonings(id);
  const ingredients = buildIngredients(id);
  const steps = buildSteps(id);
  const appraises = buildAppraises(id);
  return {
    id,
    name,
    cover: `https://picsum.photos/seed/recipe-${id}/96/96`,
    ingredientCount: ingredients.length,
    seasoningCount: seasonings.length,
    stepCount: steps.length,
    durationMinutes: 15 + index * 2,
    viewCount: 800 + index * 137,
    activityValue: 65 + (index % 12) * 3,
    popularityValue: 78 + (index % 10) * 4,
    verifyStatus: index % 3 === 0 ? 1 : 2,
    comprehensiveScore: index % 5,
    tags: index % 2 === 0 ? ["家常菜", "高蛋白"] : ["快手菜", "低脂"],
    createdAt: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
    tips: "建议出锅前撒少量葱花提香，口感会更好。",
    seasonings,
    ingredients,
    steps,
    appraises
  };
});

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function averageScore(
  list: RecipeAppraiseUserItem[],
  key: keyof Omit<RecipeAppraiseUserItem, "id" | "username">
) {
  if (list.length === 0) return 0;
  const total = list.reduce((sum, item) => sum + item[key], 0);
  return Number((total / list.length).toFixed(1));
}

export default defineFakeRoute([
  {
    url: "/recipe/list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 10);
      const keyword = String(query?.keyword ?? "").trim();
      const verifyStatus = String(query?.verifyStatus ?? "").trim();

      const filteredList = recipeList.filter(item => {
        const matchesKeyword = keyword ? item.name.includes(keyword) : true;
        const matchesStatus = verifyStatus ? item.verifyStatus === 2 : true;
        return matchesKeyword && matchesStatus;
      });

      const startIndex = (pageNum - 1) * pageSize;
      const paginatedList = filteredList
        .slice(startIndex, startIndex + pageSize)
        .map(item => ({
          id: item.id,
          name: item.name,
          cover: item.cover,
          ingredientCount: item.ingredientCount,
          seasoningCount: item.seasoningCount,
          stepCount: item.stepCount,
          durationMinutes: item.durationMinutes,
          viewCount: item.viewCount,
          activityValue: item.activityValue,
          popularityValue: item.popularityValue,
          comprehensiveScore: item.comprehensiveScore,
          verifyStatus: item.verifyStatus,
          tags: item.tags,
          createdAt: item.createdAt
        }));

      return {
        success: true,
        code: 200,
        data: {
          list: paginatedList,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/recipe/appraise/list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const keyword = String(query?.keyword ?? "").trim();

      const filteredList = recipeList.filter(item =>
        keyword ? item.name.includes(keyword) : true
      );

      const startIndex = (pageNum - 1) * pageSize;
      const paginatedList = filteredList
        .slice(startIndex, startIndex + pageSize)
        .map(item => ({
          recipeId: item.id,
          recipeName: item.name,
          operationScore: averageScore(item.appraises, "operationScore"),
          matchingScore: averageScore(item.appraises, "matchingScore"),
          satisfactionScore: averageScore(item.appraises, "satisfactionScore")
        }));

      return {
        success: true,
        code: 200,
        data: {
          list: paginatedList,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/recipe/appraise/detail",
    method: "get",
    response: ({ query }) => {
      const recipeId = Number(query?.recipeId);
      const recipe = recipeList.find(item => item.id === recipeId);

      return {
        success: true,
        code: 200,
        data: {
          recipeName: recipe?.name ?? "未知菜谱",
          list: recipe?.appraises ?? []
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/recipe/appraise/reset",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "重置成功"
      };
    }
  },
  {
    url: "/recipe/detail",
    method: "get",
    response: ({ query }) => {
      const id = Number(query?.id);
      const recipe = recipeList.find(item => item.id === id);

      return {
        success: true,
        code: 200,
        data: recipe ?? recipeList[0],
        message: "请求成功"
      };
    }
  },
  {
    url: "/recipe/create",
    method: "post",
    response: ({ body }) => {
      const recipeBody = body as CreateRecipeBody;
      const nextId =
        recipeList.length > 0
          ? Math.max(...recipeList.map(item => item.id)) + 1
          : 1;
      const newRecipe: RecipeItem = {
        id: nextId,
        name: recipeBody.name,
        cover:
          recipeBody.cover ||
          `https://picsum.photos/seed/recipe-${nextId}/96/96`,
        ingredientCount: recipeBody.ingredients.length,
        seasoningCount: recipeBody.seasonings.length,
        stepCount: recipeBody.steps.length,
        durationMinutes: recipeBody.durationMinutes,
        viewCount: 0,
        activityValue: 0,
        popularityValue: 0,
        verifyStatus: "unverified",
        tags: recipeBody.tips ? ["待校验"] : [],
        createdAt: new Date().toISOString().slice(0, 10),
        tips: recipeBody.tips,
        seasonings: recipeBody.seasonings.map((item, index) => ({
          id: nextId * 100 + index + 1,
          name: item.name,
          dosage: item.dosage
        })),
        ingredients: recipeBody.ingredients.map((item, index) => ({
          id: nextId * 200 + index + 1,
          name: item.name,
          dosage: item.dosage,
          preparation: item.preparation
        })),
        steps: recipeBody.steps.map((item, index) => ({
          id: nextId * 300 + index + 1,
          order: item.order,
          description: item.description,
          sampleImage: item.sampleImage
        })),
        appraises: []
      };

      recipeList.unshift(newRecipe);

      return {
        success: true,
        code: 200,
        data: {
          id: nextId
        },
        message: "创建成功"
      };
    }
  },
  {
    url: "/recipe/delete",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      const targetIndex = recipeList.findIndex(item => item.id === id);
      if (targetIndex >= 0) {
        recipeList.splice(targetIndex, 1);
      }

      return {
        success: true,
        code: 200,
        data: null,
        message: "删除成功"
      };
    }
  }
]);
