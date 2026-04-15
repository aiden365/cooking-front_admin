import { http } from "@/utils/http";
import { baseUrlApi, getFileAccessUrl } from "./utils";

export interface FileUploadResult {
  code: number;
  data: string;
  message: string;
}

export const uploadFile = (file: File, type?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  return http.request<FileUploadResult>("post", baseUrlApi("file/upload"), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getUploadedFileUrl = (path?: string) => getFileAccessUrl(path);
