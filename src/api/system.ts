import { http } from "@/utils/http";

export interface UserListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
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

export interface UserDetailResult {
  success: boolean;
  code: number;
  data: UserDetail;
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

export const getUserList = (params: UserListParams) => {
  return http.request<UserListResult>("get", "/system/user/list", { params });
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
