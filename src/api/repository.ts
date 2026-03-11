import { http } from "@/utils/http";

export interface RepositoryListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}

export interface RepositoryItem {
  id: number;
  name: string;
  description: string;
  fileName: string;
  fileUrl: string;
  creatorName: string;
  createdAt: string;
}

export interface RepositoryDetail extends RepositoryItem {}

export interface RepositorySavePayload {
  id?: number;
  name: string;
  description: string;
  fileName: string;
  fileUrl: string;
}

export interface RepositoryListResult {
  success: boolean;
  code: number;
  data: {
    list: RepositoryItem[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
  message: string;
}

export interface RepositoryDetailResult {
  success: boolean;
  code: number;
  data: RepositoryDetail;
  message: string;
}

export interface RepositoryActionResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export const getRepositoryList = (params: RepositoryListParams) => {
  return http.request<RepositoryListResult>("get", "/repository/list", {
    params
  });
};

export const getRepositoryDetail = (id: number) => {
  return http.request<RepositoryDetailResult>("get", "/repository/detail", {
    params: { id }
  });
};

export const saveRepository = (data: RepositorySavePayload) => {
  return http.request<RepositoryActionResult>("post", "/repository/save", {
    data
  });
};

export const deleteRepository = (id: number) => {
  return http.request<RepositoryActionResult>("post", "/repository/delete", {
    data: { id }
  });
};
