import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type RecipeVerifyStatus = 1 | 2;
export type RecipeCheckStatus = 1 | 2;

export interface RecipeListParams {
  pageNo: number;
  pageSize: number;
  search?: string;
  checkStatus?: RecipeVerifyStatus | "";
}

export interface DishScorePageParams {
  pageNum: number;
  pageSize: number;
  search?: string;
}

export interface UserAppraisePageParams {
  pageNum: number;
  pageSize: number;
  dishId: number;
  search?: string;
}

export interface RecipeSeasoningItem {
  id: number;
  flavorName: string;
  dosage: string;
}

export interface RecipeIngredientItem {
  id: number;
  materialName: string;
  dosage: string;
  deal: string;
}

export interface RecipeStepItem {
  id: number;
  sort: number;
  stepDescribe: string;
  stepImage: string;
}

export interface RecipeItem {
  id: number;
  name: string;
  cover: string;
  materialCount: number;
  flavorCount: number;
  stepCount: number;
  takeTimes: string;
  checkStatus: RecipeCheckStatus;
  viewCount: number;
  activeVal: number;
  popularVal: number;
  totalScore: number;
  labelNames: string[];
  createTime: string;
  imgPath: string;
}

export interface RecipeDetail extends RecipeItem {
  tips: string;
  flavorList: RecipeSeasoningItem[];
  materialList: RecipeIngredientItem[];
  stepList: RecipeStepItem[];
}

export interface UserAppraiseItem {
  id: number;
  username: string;
  manipulationScore: number;
  equalScore: number;
  satisfactionScore: number;
  updateTime: string;
}

export interface RecipeAppraiseItem {
  id: number;
  dishId: number;
  userName: string;
  dishName: string;
  manipulationScoreAvg: number;
  equalScoreAvg: number;
  satisfactionScoreAvg: number;
}

export interface CreateRecipePayload {
  id: number;
  name: string;
  takeTimes: string;
  checkStatus: RecipeCheckStatus;
  tips: string;
  imgPath: string;
  flavors: Array<Pick<RecipeSeasoningItem, "id" | "flavorName" | "dosage">>;
  materials: Array<
    Pick<RecipeIngredientItem, "id" | "materialName" | "dosage" | "deal">
  >;
  steps: Array<
    Pick<RecipeStepItem, "id" | "sort" | "stepDescribe" | "stepImage">
  >;
}

export interface RecipeListResult {
  success: boolean;
  code: number;
  data: {
    records: RecipeItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface DishScorePageResult {
  success: boolean;
  code: number;
  data: {
    records: RecipeAppraiseItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface UserAppraiseResult {
  success: boolean;
  code: number;
  data: {
    records: UserAppraiseItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface RecipeDetailResult {
  success: boolean;
  code: number;
  data: RecipeDetail;
  message: string;
}

export interface RecipeDeleteResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export interface AppraisesDeleteResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export interface RecipeCreateResult {
  success: boolean;
  code: number;
  data: {
    id: number;
  };
  message: string;
}

export const getRecipeList = (data: RecipeListParams) => {
  return http.request<RecipeListResult>("post", baseUrlApi("dish/page"), {
    data
  });
};

export const getDishScorePage = (data: DishScorePageParams) => {
  return http.request<DishScorePageResult>(
    "post",
    baseUrlApi("appraises/dishScorePage"),
    {
      data
    }
  );
};

export const getUserAppraisePage = (data: UserAppraisePageParams) => {
  return http.request<UserAppraiseResult>(
    "post",
    baseUrlApi("appraises/page"),
    {
      data
    }
  );
};

export const resetRecipeAppraise = (recipeId: number) => {
  return http.request<RecipeDeleteResult>("post", "/recipe/appraise/reset", {
    data: { recipeId }
  });
};

export const deleteAppraises = (id: number) => {
  return http.request<AppraisesDeleteResult>(
    "post",
    baseUrlApi("appraises/delete"),
    {
      data: { id }
    }
  );
};

export const getRecipeDetail = (dishId: number) => {
  return http.request<RecipeDetailResult>("post", baseUrlApi("dish/detail"), {
    data: { dishId }
  });
};

export const createRecipe = (data: CreateRecipePayload) => {
  return http.request<RecipeCreateResult>("post", baseUrlApi("dish/save"), {
    data
  });
};

export const deleteRecipe = (id: number) => {
  return http.request<RecipeDeleteResult>("post", baseUrlApi("dish/delete"), {
    data: { ids: [id] }
  });
};
