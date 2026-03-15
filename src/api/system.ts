import { http } from "@/utils/http";

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

export interface UserDetail extends Omit<UserListItem, "registerTime"> {}

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
    list: UserListItem[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
  message: string;
}

export interface UserShareListResult {
  success: boolean;
  code: number;
  data: {
    list: UserShareItem[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
  message: string;
}

export interface UserDietListResult {
  success: boolean;
  code: number;
  data: {
    list: UserDietItem[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
  message: string;
}

export interface UserNutritionListResult {
  success: boolean;
  code: number;
  data: {
    list: UserNutritionItem[];
    total: number;
    pageNum: number;
    pageSize: number;
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

export interface AdminDetail extends Omit<AdminListItem, "registerTime"> {}

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
    list: AdminListItem[];
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
  | "emailConfig";

export interface SystemConfigCardItem {
  key: SystemConfigKey;
  name: string;
  description: string;
}

export interface AiModelConfig {
  ApiUrl: string;
  ApiKey: string;
}

export interface SystemConfigDetail {
  key: SystemConfigKey;
  name: string;
  description: string;
  aiModelConfig?: AiModelConfig;
  maxCount?: number;
  nutritionNames?: string[];
}

export interface SaveSystemConfigPayload {
  key: SystemConfigKey;
  aiModelConfig?: AiModelConfig;
  maxCount?: number;
  nutritionNames?: string[];
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
    "/system/config/nutrition-names"
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

export const getUserDetail = (userId: number) => {
  return http.request<UserDetailResult>("get", "/system/user/detail", {
    params: { userId }
  });
};

export const saveUser = (data: UserSavePayload) => {
  return http.request<UserActionResult>("post", "/system/user/save", {
    data
  });
};

export const resetUserPassword = (data: ResetPasswordPayload) => {
  return http.request<UserActionResult>("post", "/system/user/reset-password", {
    data
  });
};

export const updateUserStatus = (data: UpdateUserStatusPayload) => {
  return http.request<UserActionResult>("post", "/system/user/update-status", {
    data
  });
};

export const getSystemConfigList = () => {
  return http.request<SystemConfigListResult>("get", "/system/config/list");
};

export const getSystemConfigDetail = (key: SystemConfigKey) => {
  return http.request<SystemConfigDetailResult>(
    "get",
    "/system/config/detail",
    {
      params: { key }
    }
  );
};

export const saveSystemConfig = (data: SaveSystemConfigPayload) => {
  return http.request<UserActionResult>("post", "/system/config/save", {
    data
  });
};

export const getAdminList = (params: AdminListParams) => {
  return http.request<AdminListResult>("get", "/system/admin/list", { params });
};

export const getAdminDetail = (adminId: number) => {
  return http.request<AdminDetailResult>("get", "/system/admin/detail", {
    params: { adminId }
  });
};

export const saveAdmin = (data: AdminSavePayload) => {
  return http.request<UserActionResult>("post", "/system/admin/save", {
    data
  });
};

export const resetAdminPassword = (data: ResetAdminPasswordPayload) => {
  return http.request<UserActionResult>(
    "post",
    "/system/admin/reset-password",
    {
      data
    }
  );
};

export const updateAdminStatus = (data: UpdateAdminStatusPayload) => {
  return http.request<UserActionResult>("post", "/system/admin/update-status", {
    data
  });
};
