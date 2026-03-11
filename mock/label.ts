import { defineFakeRoute } from "vite-plugin-fake-server/client";

interface DishLabelItem {
  id: number;
  sort: number;
  name: string;
  createdAt: string;
}

interface SaveDishLabelBody {
  name: string;
  sort: number;
}

const dishLabels: DishLabelItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  sort: index + 1,
  name: ["家常菜", "高蛋白", "低脂", "早餐", "快手菜", "汤羹"][index % 6] + (index + 1),
  createdAt: `2026-03-${String((index % 28) + 1).padStart(2, "0")} 09:00:00`
}));

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default defineFakeRoute([
  {
    url: "/label/dish/list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const keyword = String(query?.keyword ?? "").trim();

      const filteredList = dishLabels.filter(item =>
        keyword ? item.name.includes(keyword) : true
      );
      const startIndex = (pageNum - 1) * pageSize;
      const list = filteredList.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        code: 200,
        data: {
          list,
          total: filteredList.length,
          pageNum,
          pageSize
        },
        message: "请求成功"
      };
    }
  },
  {
    url: "/label/dish/save",
    method: "post",
    response: ({ body }) => {
      const payload = body as SaveDishLabelBody;
      const nextId = dishLabels.length > 0 ? Math.max(...dishLabels.map(item => item.id)) + 1 : 1;
      dishLabels.unshift({
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
  },
  {
    url: "/label/dish/delete",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      const index = dishLabels.findIndex(item => item.id === id);
      if (index >= 0) {
        dishLabels.splice(index, 1);
      }
      return {
        success: true,
        code: 200,
        data: null,
        message: "删除成功"
      };
    }
  }
]);
