import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export type RepositoryType = 1 | 2;

export interface RepositoryListParams {
  pageNum: number;
  pageSize: number;
  search?: string;
  type?: RepositoryType | "";
}

export interface RepositoryItem {
  id: number;
  name: string;
  type: RepositoryType;
  fileName: string;
  description: string;
  content: string;
  fileUrl: string;
  creatorName: string;
  creatorTime: string;
}

export interface RepositorySavePayload {
  id?: number;
  name: string;
  type: RepositoryType;
  description: string;
  content: string;
}

export interface RepositoryListResult {
  success: boolean;
  code: number;
  data: {
    records: RepositoryItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface RepositoryDetailResult {
  success: boolean;
  code: number;
  data: RepositoryItem;
  message: string;
}

export interface RepositoryActionResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export const getRepositoryList = (data: RepositoryListParams) => {
  return http.request<RepositoryListResult>(
    "post",
    baseUrlApi("repository/page"),
    {
      data
    }
  );
};

export const getRepositoryDetail = (id: number) => {
  return http.request<RepositoryDetailResult>(
    "post",
    baseUrlApi("repository/detail"),
    {
      data: { id }
    }
  );
};

export const saveRepository = (data: RepositorySavePayload) => {
  return http.request<RepositoryActionResult>(
    "post",
    baseUrlApi("repository/save"),
    {
      data
    }
  );
};

export const deleteRepository = (id: number) => {
  return http.request<RepositoryActionResult>(
    "post",
    baseUrlApi("repository/delete"),
    {
      data: { ids: [id] }
    }
  );
};
