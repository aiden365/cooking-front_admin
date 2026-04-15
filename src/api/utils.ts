export const baseUrlApi = (url: string) => `/api/${url}`;

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export const getApiServiceUrl = () => {
  const { VITE_API_BASE_URL } = import.meta.env;
  return trimTrailingSlash(VITE_API_BASE_URL || window.location.origin);
};

export const getFileAccessUrl = (path?: string) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${getApiServiceUrl()}${path.startsWith("/") ? path : `/${path}`}`;
};
