import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export interface LabelListParams {
  pageNum: number;
  pageSize: number;
  search?: string;
  type: number;
}

export interface LabelItem {
  id: number;
  type: number;
  labelName: string;
  createTime: string;
}

export interface LabelListResult {
  success: boolean;
  code: number;
  data: {
    records: LabelItem[];
    total: number;
    current: number;
    size: number;
  };
  message: string;
}

export interface SaveLabelPayload {
  labelName: string;
  type: number;
}

export interface LabelActionResult {
  success: boolean;
  code: number;
  data: null;
  message: string;
}

export const getLabelList = (data: LabelListParams) => {
  return http.request<LabelListResult>("post", baseUrlApi("label/page"), {
    data
  });
};

export const saveLabel = (data: SaveLabelPayload) => {
  return http.request<LabelActionResult>("post", baseUrlApi("label/save"), {
    data
  });
};

export const deleteLabel = (id: number) => {
  return http.request<LabelActionResult>("post", baseUrlApi("label/delete"), {
    data: { id }
  });
};
