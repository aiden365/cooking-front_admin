import { defineFakeRoute } from "vite-plugin-fake-server/client";

type RecipeVerifyStatus = "verified" | "unverified";

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
  verifyStatus: RecipeVerifyStatus;
  tags: string[];
  createdAt: string;
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

const recipeList: RecipeItem[] = Array.from({ length: 60 }, (_, index) => {
  const id = index + 1;
  const name = `${recipeNamePool[index % recipeNamePool.length]} ${id}`;
  return {
    id,
    name,
    cover: `https://picsum.photos/seed/recipe-${id}/96/96`,
    ingredientCount: 4 + (index % 6),
    seasoningCount: 2 + (index % 5),
    stepCount: 5 + (index % 7),
    durationMinutes: 15 + index * 2,
    viewCount: 800 + index * 137,
    activityValue: 65 + (index % 12) * 3,
    popularityValue: 78 + (index % 10) * 4,
    verifyStatus: index % 3 === 0 ? "unverified" : "verified",
    tags: index % 2 === 0 ? ["家常菜", "高蛋白"] : ["快手菜", "低脂"],
    createdAt: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`
  };
});

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
        const matchesStatus = verifyStatus
          ? item.verifyStatus === verifyStatus
          : true;
        return matchesKeyword && matchesStatus;
      });

      const startIndex = (pageNum - 1) * pageSize;
      const paginatedList = filteredList.slice(startIndex, startIndex + pageSize);

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
      const nextId = recipeList.length > 0 ? Math.max(...recipeList.map(item => item.id)) + 1 : 1;
      const newRecipe: RecipeItem = {
        id: nextId,
        name: recipeBody.name,
        cover: recipeBody.cover || `https://picsum.photos/seed/recipe-${nextId}/96/96`,
        ingredientCount: recipeBody.ingredients.length,
        seasoningCount: recipeBody.seasonings.length,
        stepCount: recipeBody.steps.length,
        durationMinutes: recipeBody.durationMinutes,
        viewCount: 0,
        activityValue: 0,
        popularityValue: 0,
        verifyStatus: "unverified",
        tags: recipeBody.tips ? ["待校验"] : [],
        createdAt: new Date().toISOString().slice(0, 10)
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
