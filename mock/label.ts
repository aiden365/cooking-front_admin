import { defineFakeRoute } from "vite-plugin-fake-server/client";

interface LabelItem {
  id: number;
  type: number;
  labelName: string;
  createTime: string;
}

interface LabelPageBody {
  pageNum?: number;
  pageSize?: number;
  labelName?: string;
  labelIds?: number[];
  type?: number;
}

interface SaveLabelBody {
  labelName?: string;
  type?: number;
}

interface DishLabelBody {
  dishId?: number;
  labelId?: number;
}

const dishLabelSeeds = [
  "家常菜",
  "高蛋白",
  "低脂",
  "早餐",
  "快手菜",
  "汤羹",
  "川菜",
  "粤菜",
  "减脂餐",
  "下饭菜"
];

const userLabelSeeds = ["感冒", "发烧", "经期", "糖尿病", "痛风", "不吃辣"];

const labelList: LabelItem[] = [
  ...dishLabelSeeds.map((labelName, index) => ({
    id: index + 1,
    type: 2,
    labelName,
    createTime: `2026-03-${String(index + 1).padStart(2, "0")} 09:00:00`
  })),
  ...userLabelSeeds.map((labelName, index) => ({
    id: dishLabelSeeds.length + index + 1,
    type: 1,
    labelName,
    createTime: `2026-03-${String(index + 1).padStart(2, "0")} 10:00:00`
  }))
];

const dishLabelMap = new Map<number, number[]>(
  Array.from({ length: 60 }, (_, index) => {
    const dishId = index + 1;
    const labelIds =
      dishId % 3 === 0
        ? [1, 2, 7]
        : dishId % 3 === 1
          ? [3, 4]
          : [5, 6, 8];
    return [dishId, labelIds];
  })
);

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function buildSuccess<T>(data: T, message = "success") {
  return {
    code: 0,
    data,
    message,
    success: true
  };
}

function getFilteredLabels(body: LabelPageBody) {
  const pageNum = parseNumber(body?.pageNum, 1);
  const pageSize = parseNumber(body?.pageSize, 7);
  const type = body?.type;
  const labelName = String(body?.labelName ?? "").trim();
  const labelIds = Array.isArray(body?.labelIds) ? body.labelIds : undefined;

  let filteredList = labelList.filter(item => (type ? item.type === type : true));

  if (labelName) {
    filteredList = filteredList.filter(item => item.labelName.includes(labelName));
  }

  if (labelIds) {
    filteredList = filteredList.filter(item => labelIds.includes(item.id));
  }

  const total = filteredList.length;
  const pages = total > 0 ? Math.ceil(total / pageSize) : 0;
  const startIndex = (pageNum - 1) * pageSize;

  return buildSuccess({
    current: pageNum,
    pages,
    records: filteredList.slice(startIndex, startIndex + pageSize),
    size: pageSize,
    total
  });
}

function saveLabel(body: SaveLabelBody) {
  const nextId =
    labelList.length > 0 ? Math.max(...labelList.map(item => item.id)) + 1 : 1;

  labelList.unshift({
    id: nextId,
    type: Number(body?.type ?? 1),
    labelName: String(body?.labelName ?? "").trim(),
    createTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  });

  return buildSuccess(null, "保存成功");
}

function deleteLabel(id: number) {
  const index = labelList.findIndex(item => item.id === id);
  if (index >= 0) {
    labelList.splice(index, 1);
  }

  dishLabelMap.forEach((labelIds, dishId) => {
    dishLabelMap.set(
      dishId,
      labelIds.filter(labelId => labelId !== id)
    );
  });

  return buildSuccess(null, "删除成功");
}

function getDishLabels(dishId: number) {
  const labelIds = dishLabelMap.get(dishId) ?? [];
  const records = labelList
    .filter(item => item.type === 2 && labelIds.includes(item.id))
    .map(item => ({
      id: item.id,
      labelName: item.labelName
    }));

  return buildSuccess(records);
}

function updateDishLabel(body: DishLabelBody, mode: "add" | "delete") {
  const dishId = Number(body?.dishId);
  const labelId = Number(body?.labelId);
  const currentIds = dishLabelMap.get(dishId) ?? [];
  const nextIds =
    mode === "add"
      ? Array.from(new Set([...currentIds, labelId]))
      : currentIds.filter(id => id !== labelId);

  dishLabelMap.set(dishId, nextIds);
  return buildSuccess(null, mode === "add" ? "添加成功" : "移除成功");
}

export default defineFakeRoute([
  {
    url: "/api/label/page",
    method: "post",
    response: ({ body }) => getFilteredLabels(body as LabelPageBody)
  },
  {
    url: "/label/page",
    method: "post",
    response: ({ body }) => getFilteredLabels(body as LabelPageBody)
  },
  {
    url: "/api/label/save",
    method: "post",
    response: ({ body }) => saveLabel(body as SaveLabelBody)
  },
  {
    url: "/label/save",
    method: "post",
    response: ({ body }) => saveLabel(body as SaveLabelBody)
  },
  {
    url: "/api/label/delete",
    method: "post",
    response: ({ body }) => deleteLabel(Number(body?.id))
  },
  {
    url: "/label/delete",
    method: "post",
    response: ({ body }) => deleteLabel(Number(body?.id))
  },
  {
    url: "/api/dish/labels",
    method: "post",
    response: ({ body }) => getDishLabels(Number(body?.dishId))
  },

  {
    url: "/api/dish/addLabel",
    method: "post",
    response: ({ body }) => updateDishLabel(body as DishLabelBody, "add")
  },
  {
    url: "/dish/addLabel",
    method: "post",
    response: ({ body }) => updateDishLabel(body as DishLabelBody, "add")
  },
  {
    url: "/api/dish/delLabel",
    method: "post",
    response: ({ body }) => updateDishLabel(body as DishLabelBody, "delete")
  },
  {
    url: "/dish/delLabel",
    method: "post",
    response: ({ body }) => updateDishLabel(body as DishLabelBody, "delete")
  }
]);
