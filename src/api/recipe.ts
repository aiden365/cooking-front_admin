import { http } from "@/utils/http";

export type RecipeVerifyStatus = "verified" | "unverified";

export interface RecipeListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  verifyStatus?: RecipeVerifyStatus | "";
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
  verifyStatus: RecipeVerifyStatus;
  tags: string[];
  createdAt: string;
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

export interface RecipeDetailResult {
  success: boolean;
  code: number;
  data: RecipeItem;
  message: string;
}

export interface RecipeDeleteResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export const getRecipeList = (params: RecipeListParams) => {
  return http.request<RecipeListResult>("get", "/recipe/list", { params });
};

export const getRecipeDetail = (id: number) => {
  return http.request<RecipeDetailResult>("get", "/recipe/detail", {
    params: { id }
  });
};

export const deleteRecipe = (id: number) => {
  return http.request<RecipeDeleteResult>("post", "/recipe/delete", {
    data: { id }
  });
};
