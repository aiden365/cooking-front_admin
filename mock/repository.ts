import { defineFakeRoute } from "vite-plugin-fake-server/client";

interface RepositoryItem {
  id: number;
  name: string;
  description: string;
  fileName: string;
  fileUrl: string;
  creatorName: string;
  createdAt: string;
}

interface RepositorySaveBody {
  id?: number;
  name: string;
  description: string;
  fileName: string;
  fileUrl: string;
}

const repositoryList: RepositoryItem[] = Array.from({ length: 16 }, (_, index) => {
  const isPdf = index % 2 === 0;
  return {
    id: index + 1,
    name: `知识文档 ${index + 1}`,
    description:
      "用于支撑智能菜谱问答的知识文档，包含食材营养、疾病禁忌和烹饪技巧等结构化内容。",
    fileName: `${1741708800000 + index * 60000}.${isPdf ? "pdf" : "txt"}`,
    fileUrl: `https://example.com/files/repository-${index + 1}.${isPdf ? "pdf" : "txt"}`,
    creatorName: ["管理员A", "管理员B", "营养师小林"][index % 3],
    createdAt: `2026-03-${String((index % 28) + 1).padStart(2, "0")} 11:00:00`
  };
});

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default defineFakeRoute([
  {
    url: "/repository/list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const keyword = String(query?.keyword ?? "").trim();

      const filteredList = repositoryList.filter(item =>
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
    url: "/repository/detail",
    method: "get",
    response: ({ query }) => {
      const id = Number(query?.id);
      const repository = repositoryList.find(item => item.id === id) ?? repositoryList[0];
      return {
        success: true,
        code: 200,
        data: repository,
        message: "请求成功"
      };
    }
  },
  {
    url: "/repository/save",
    method: "post",
    response: ({ body }) => {
      const payload = body as RepositorySaveBody;
      if (payload.id) {
        const target = repositoryList.find(item => item.id === payload.id);
        if (target) {
          target.name = payload.name;
          target.description = payload.description;
          target.fileName = payload.fileName;
          target.fileUrl = payload.fileUrl;
        }
      } else {
        const nextId = repositoryList.length > 0 ? Math.max(...repositoryList.map(item => item.id)) + 1 : 1;
        repositoryList.unshift({
          id: nextId,
          name: payload.name,
          description: payload.description,
          fileName: payload.fileName,
          fileUrl: payload.fileUrl,
          creatorName: "当前管理员",
          createdAt: new Date().toISOString().slice(0, 19).replace("T", " ")
        });
      }

      return {
        success: true,
        code: 200,
        data: null,
        message: "保存成功"
      };
    }
  },
  {
    url: "/repository/delete",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      const index = repositoryList.findIndex(item => item.id === id);
      if (index >= 0) {
        repositoryList.splice(index, 1);
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
