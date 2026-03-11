import { defineFakeRoute } from "vite-plugin-fake-server/client";

interface LabelItem {
  id: number;
  sort: number;
  name: string;
  createdAt: string;
}

interface SaveLabelBody {
  name: string;
  sort: number;
}

const dishLabels: LabelItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  sort: index + 1,
  name: ["家常菜", "高蛋白", "低脂", "早餐", "快手菜", "汤羹"][index % 6] + (index + 1),
  createdAt: `2026-03-${String((index % 28) + 1).padStart(2, "0")} 09:00:00`
}));

const userLabelSeeds = ["感冒", "发烧", "经期", "糖尿病", "痛风", "不吃辣"];
const userLabels: LabelItem[] = userLabelSeeds.map((name, index) => ({
  id: index + 1,
  sort: index + 1,
  name,
  createdAt: `2026-03-${String(index + 1).padStart(2, "0")} 10:00:00`
}));

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function buildListResponse(list: LabelItem[], query: Record<string, unknown>) {
  const pageNum = parseNumber(query?.pageNum, 1);
  const pageSize = parseNumber(query?.pageSize, 7);
  const keyword = String(query?.keyword ?? "").trim();

  const filteredList = list.filter(item =>
    keyword ? item.name.includes(keyword) : true
  );
  const startIndex = (pageNum - 1) * pageSize;

  return {
    success: true,
    code: 200,
    data: {
      list: filteredList.slice(startIndex, startIndex + pageSize),
      total: filteredList.length,
      pageNum,
      pageSize
    },
    message: "请求成功"
  };
}

function saveLabel(list: LabelItem[], payload: SaveLabelBody) {
  const nextId = list.length > 0 ? Math.max(...list.map(item => item.id)) + 1 : 1;
  list.unshift({
    id: nextId,
    sort: payload.sort,
    name: payload.name,
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " ")
  });

  return {
    success: true,
    code: 200,
    data: null,
    message: "保存成功"
  };
}

function deleteLabel(list: LabelItem[], id: number) {
  const index = list.findIndex(item => item.id === id);
  if (index >= 0) {
    list.splice(index, 1);
  }

  return {
    success: true,
    code: 200,
    data: null,
    message: "删除成功"
  };
}

export default defineFakeRoute([
  {
    url: "/label/dish/list",
    method: "get",
    response: ({ query }) => buildListResponse(dishLabels, query)
  },
  {
    url: "/label/user/list",
    method: "get",
    response: ({ query }) => buildListResponse(userLabels, query)
  },
  {
    url: "/label/dish/save",
    method: "post",
    response: ({ body }) => saveLabel(dishLabels, body as SaveLabelBody)
  },
  {
    url: "/label/user/save",
    method: "post",
    response: ({ body }) => saveLabel(userLabels, body as SaveLabelBody)
  },
  {
    url: "/label/dish/delete",
    method: "post",
    response: ({ body }) => deleteLabel(dishLabels, Number(body?.id))
  },
  {
    url: "/label/user/delete",
    method: "post",
    response: ({ body }) => deleteLabel(userLabels, Number(body?.id))
  }
]);
