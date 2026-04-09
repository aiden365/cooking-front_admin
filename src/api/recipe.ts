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

export interface RecipeAppraiseListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
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
  order: number;
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
  tags: string[];
  createTime: string;
}

export interface RecipeDetail extends RecipeItem {
  tips: string;
  seasonings: RecipeSeasoningItem[];
  ingredients: RecipeIngredientItem[];
  steps: RecipeStepItem[];
}

export interface RecipeAppraiseUserItem {
  id: number;
  username: string;
  operationScore: number;
  matchingScore: number;
  satisfactionScore: number;
}

export interface RecipeAppraiseItem {
  recipeId: number;
  recipeName: string;
  operationScore: number;
  matchingScore: number;
  satisfactionScore: number;
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
    Pick<RecipeStepItem, "id" | "order" | "stepDescribe" | "stepImage">
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

export interface RecipeAppraiseListResult {
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

export interface RecipeAppraiseDetailResult {
  success: boolean;
  code: number;
  data: {
    recipeName: string;
    list: RecipeAppraiseUserItem[];
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

export const getRecipeAppraiseList = (params: RecipeAppraiseListParams) => {
  return http.request<RecipeAppraiseListResult>(
    "get",
    "/recipe/appraise/list",
    {
      params
    }
  );
};

export const getRecipeAppraiseDetail = (recipeId: number) => {
  return http.request<RecipeAppraiseDetailResult>(
    "get",
    "/recipe/appraise/detail",
    {
      params: { recipeId }
    }
  );
};

export const resetRecipeAppraise = (recipeId: number) => {
  return http.request<RecipeDeleteResult>("post", "/recipe/appraise/reset", {
    data: { recipeId }
  });
};

export const getRecipeDetail = (id: number) => {
  return http.request<RecipeDetailResult>("get", "/recipe/detail", {
    params: { id }
  });
};

export const createRecipe = (data: CreateRecipePayload) => {
  return http.request<RecipeCreateResult>("post", baseUrlApi("dish/save"), {
    data
  });
};

export const deleteRecipe = (id: number) => {
  return http.request<RecipeDeleteResult>("post", "/recipe/delete", {
    data: { id }
  });
};
