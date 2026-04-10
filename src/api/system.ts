import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export interface UserListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}

export interface UserShareListParams {
  pageNum: number;
  pageSize: number;
  username?: string;
  recipeName?: string;
}

export interface UserDietListParams {
  pageNum: number;
  pageSize: number;
  username?: string;
  recipeName?: string;
  date?: string;
  mealTime?: 1 | 2 | 3 | "";
}

export interface UserNutritionListParams {
  pageNum: number;
  pageSize: number;
  username?: string;
}

export interface UserListItem {
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

export type UserDetail = Omit<UserListItem, "registerTime">;

export interface UserShareItem {
  id: number;
  username: string;
  recipeName: string;
  description: string;
  imageName: string;
}

export interface UserShareDetail extends UserShareItem {
  imageUrl: string;
}

export interface UserDietItem {
  id: number;
  username: string;
  recipeName: string;
  date: string;
  mealTime: 1 | 2 | 3;
}

export interface UserNutritionItem {
  id: number;
  username: string;
  nutritionCount: number;
  gender: "男" | "女";
  age: number;
  height: number;
  weight: number;
}

export interface UserNutritionTargetItem {
  id: number;
  nutritionName: string;
  targetValue: string;
}

export interface UserSavePayload {
  id?: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  height: number;
  weight: number;
  status: 1 | 3;
}

export interface UserListResult {
  success: boolean;
  code: number;
  data: {
    records: UserListItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface UserShareListResult {
  success: boolean;
  code: number;
  data: {
    records: UserShareItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface UserDietListResult {
  success: boolean;
  code: number;
  data: {
    records: UserDietItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface UserNutritionListResult {
  success: boolean;
  code: number;
  data: {
    records: UserNutritionItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface UserNutritionTargetListResult {
  success: boolean;
  code: number;
  data: {
    username: string;
    list: UserNutritionTargetItem[];
  };
  message: string;
}

export interface NutritionNameConfigResult {
  success: boolean;
  code: number;
  data: string[];
  message: string;
}

export interface UserDetailResult {
  success: boolean;
  code: number;
  data: UserDetail;
  message: string;
}

export interface UserShareDetailResult {
  success: boolean;
  code: number;
  data: UserShareDetail;
  message: string;
}

export interface UserActionResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export interface ResetPasswordPayload {
  userId: number;
  password: string;
}

export interface UpdateUserStatusPayload {
  userId: number;
  status: 1 | 3;
}

export interface SaveUserNutritionTargetPayload {
  id: number;
  nutritionName: string;
  targetValue: string;
}

export interface SystemNutritionListParams {
  pageNum: number;
  pageSize: number;
  search?: string;
}

export interface SystemNutritionItem {
  id: number;
  name: string;
  defaultValue: string;
  createdAt: string;
  creatorName: string;
}

export type SystemNutritionDetail = Omit<
  SystemNutritionItem,
  "createTime" | "creatorName"
>;

export interface SystemNutritionSavePayload {
  id?: number;
  name: string;
  defaultValue: string;
}

export interface SystemNutritionListResult {
  success: boolean;
  code: number;
  data: {
    records: SystemNutritionItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface SystemNutritionDetailResult {
  success: boolean;
  code: number;
  data: SystemNutritionDetail;
  message: string;
}

export interface AdminListParams {
  pageNum: number;
  pageSize: number;
  username?: string;
  status?: 1 | 2 | 3 | "";
}

export interface AdminListItem {
  id: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  status: 1 | 2 | 3;
  registerTime: string;
}

export type AdminDetail = Omit<AdminListItem, "registerTime">;

export interface AdminSavePayload {
  id?: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  status: 1 | 2 | 3;
}

export interface AdminListResult {
  success: boolean;
  code: number;
  data: {
    records: AdminListItem[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
  message: string;
}

export interface AdminDetailResult {
  success: boolean;
  code: number;
  data: AdminDetail;
  message: string;
}

export interface ResetAdminPasswordPayload {
  adminId: number;
  password: string;
}

export interface UpdateAdminStatusPayload {
  adminId: number;
  status: 1 | 2 | 3;
}

export type SystemConfigKey =
  | "aiModel"
  | "maxUserLabels"
  | "maxDishLabels"
  | "nutritionNames"
  | "maxNutritionTargets"
  | "emailConfig"
  | "maxUserLoginCount";

export interface SystemConfigCardItem {
  id: number;
  key: SystemConfigKey;
  value: string;
  name: string;
  description: string;
}

export interface AiModelConfig {
  ApiUrl: string;
  ApiKey: string;
}

export interface SystemConfigDetail {
  id: number;
  key: SystemConfigKey;
  value: string;
  name: string;
  description: string;
}

export interface SaveSystemConfigPayload {
  id: number;
  paramValue: string;
}

export interface SystemConfigListResult {
  success: boolean;
  code: number;
  data: SystemConfigCardItem[];
  message: string;
}

export interface SystemConfigDetailResult {
  success: boolean;
  code: number;
  data: SystemConfigDetail;
  message: string;
}

export const getUserList = (params: UserListParams) => {
  return http.request<UserListResult>("get", "/system/user/list", { params });
};

export const getUserShareList = (params: UserShareListParams) => {
  return http.request<UserShareListResult>("get", "/system/user/share-list", {
    params
  });
};

export const getUserDietList = (params: UserDietListParams) => {
  return http.request<UserDietListResult>("get", "/system/user/diet-list", {
    params
  });
};

export const getUserNutritionList = (params: UserNutritionListParams) => {
  return http.request<UserNutritionListResult>(
    "get",
    "/system/user/nutrition-list",
    {
      params
    }
  );
};

export const getUserNutritionTargets = (userId: number) => {
  return http.request<UserNutritionTargetListResult>(
    "get",
    "/system/user/nutrition-targets",
    {
      params: { userId }
    }
  );
};

export const getNutritionNameConfig = () => {
  return http.request<NutritionNameConfigResult>(
    "get",
    "system/param/nutrition-names"
  );
};

export const saveUserNutritionTarget = (
  data: SaveUserNutritionTargetPayload
) => {
  return http.request<UserActionResult>(
    "post",
    "/system/user/nutrition-target/save",
    {
      data
    }
  );
};

export const deleteUserNutritionTarget = (id: number) => {
  return http.request<UserActionResult>(
    "post",
    "/system/user/nutrition-target/delete",
    {
      data: { id }
    }
  );
};

export const getUserShareDetail = (shareId: number) => {
  return http.request<UserShareDetailResult>(
    "get",
    "/system/user/share-detail",
    {
      params: { shareId }
    }
  );
};

export const deleteUserShare = (shareId: number) => {
  return http.request<UserActionResult>("post", "/system/user/share-delete", {
    data: { shareId }
  });
};

export const deleteUserDiet = (dietId: number) => {
  return http.request<UserActionResult>("post", "/system/user/diet-delete", {
    data: { dietId }
  });
};

export const getSystemConfigList = () => {
  return http.request<SystemConfigListResult>(
    "post",
    baseUrlApi("system/param/list"),
    {
      data: {}
    }
  );
};

export const getSystemConfigDetail = (key: SystemConfigKey) => {
  return http.request<SystemConfigDetailResult>(
    "post",
    baseUrlApi("system/param/detail"),
    {
      data: { key }
    }
  );
};

export const saveSystemConfig = (data: SaveSystemConfigPayload) => {
  return http.request<UserActionResult>(
    "post",
    baseUrlApi("system/param/save"),
    {
      data
    }
  );
};

export const getSystemNutritionList = (data: SystemNutritionListParams) => {
  return http.request<SystemNutritionListResult>(
    "post",
    baseUrlApi("nutrition/page"),
    {
      data
    }
  );
};

export const getSystemNutritionDetail = (id: number) => {
  return http.request<SystemNutritionDetailResult>(
    "post",
    baseUrlApi("nutrition/detail"),
    {
      data: { id }
    }
  );
};

export const saveSystemNutrition = (data: SystemNutritionSavePayload) => {
  return http.request<UserActionResult>("post", baseUrlApi("nutrition/save"), {
    data
  });
};

export const deleteSystemNutrition = (id: number) => {
  return http.request<UserActionResult>(
    "post",
    baseUrlApi("nutrition/delete"),
    {
      data: { ids: [id] }
    }
  );
};
