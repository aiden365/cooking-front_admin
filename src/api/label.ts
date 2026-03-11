import { http } from "@/utils/http";

export interface DishLabelListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}

export interface DishLabelItem {
  id: number;
  sort: number;
  name: string;
  createdAt: string;
}

export interface DishLabelListResult {
  success: boolean;
  code: number;
  data: {
    list: DishLabelItem[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
  message: string;
}

export interface SaveDishLabelPayload {
  name: string;
  sort: number;
}

export interface LabelActionResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export const getDishLabelList = (params: DishLabelListParams) => {
  return http.request<DishLabelListResult>("get", "/label/dish/list", {
    params
  });
};

export const saveDishLabel = (data: SaveDishLabelPayload) => {
  return http.request<LabelActionResult>("post", "/label/dish/save", {
    data
  });
};

export const deleteDishLabel = (id: number) => {
  return http.request<LabelActionResult>("post", "/label/dish/delete", {
    data: { id }
  });
};
