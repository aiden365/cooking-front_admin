import { http } from "@/utils/http";

export type RecipeVerifyStatus = 1 | 2;

export interface RecipeListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  verifyStatus?: RecipeVerifyStatus | "";
}

export interface RecipeAppraiseListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}

export interface RecipeSeasoningItem {
  id: number;
  name: string;
  dosage: string;
}

export interface RecipeIngredientItem {
  id: number;
  name: string;
  dosage: string;
  preparation: string;
}

export interface RecipeStepItem {
  id: number;
  order: number;
  description: string;
  sampleImage: string;
}

export interface RecipeItem {
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
  name: string;
  durationMinutes: number;
  tips: string;
  cover: string;
  seasonings: Array<Pick<RecipeSeasoningItem, "name" | "dosage">>;
  ingredients: Array<
    Pick<RecipeIngredientItem, "name" | "dosage" | "preparation">
  >;
  steps: Array<Pick<RecipeStepItem, "order" | "description" | "sampleImage">>;
}

export interface RecipeListResult {
  success: boolean;
  code: number;
  data: {
    list: RecipeItem[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
  message: string;
}

export interface RecipeAppraiseListResult {
  success: boolean;
  code: number;
  data: {
    list: RecipeAppraiseItem[];
    total: number;
    pageNum: number;
    pageSize: number;
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

export const getRecipeList = (params: RecipeListParams) => {
  return http.request<RecipeListResult>("get", "/recipe/list", { params });
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
  return http.request<RecipeCreateResult>("post", "/recipe/create", {
    data
  });
};

export const deleteRecipe = (id: number) => {
  return http.request<RecipeDeleteResult>("post", "/recipe/delete", {
    data: { id }
  });
};
