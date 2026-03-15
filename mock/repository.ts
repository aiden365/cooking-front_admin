import { defineFakeRoute } from "vite-plugin-fake-server/client";

type RepositoryType = 1 | 2;

interface RepositoryItem {
  id: number;
  name: string;
  type: RepositoryType;
  description: string;
  content: string;
  fileName: string;
  fileUrl: string;
  creatorName: string;
  createdAt: string;
}

interface RepositorySaveBody {
  id?: number;
  name: string;
  type: RepositoryType;
  description: string;
  content: string;
}

/* const repositoryList: RepositoryItem[] = Array.from(
  { length: 16 },
  (_, index) => {
    const isPdf = index % 2 === 0;
    const type = index % 2 === 0 ? 1 : 2;
    return {
      id: index + 1,
      name: `知识文档 ${index + 1}`,
      type,
      description:
        "用于支撑智能菜谱问答的知识文档，包含食材营养、疾病禁忌和烹饪技巧等结构化内容。",
      content: `<p>${type === 1 ? "菜谱知识" : "营养知识"}正文内容 ${index + 1}</p><p>这里是用于展示富文本回填的模拟内容。</p>`,
      fileName: `${1741708800000 + index * 60000}.${isPdf ? "pdf" : "txt"}`,
      fileUrl: `https://example.com/files/repository-${index + 1}.${isPdf ? "pdf" : "txt"}`,
      creatorName: ["管理员A", "管理员B", "营养师小林"][index % 3],
      createdAt: `2026-03-${String((index % 28) + 1).padStart(2, "0")} 11:00:00`
    };
  }
); */

const repositoryList: RepositoryItem[] = [
  {
    id: 1,
    name: `平衡膳食八准则`,
    type: 2,
    description:
      "用于支撑饮食推荐的知识文档，包含中国居民膳食指南（2022）提出关于平衡膳食八大核心准则",
    content: `<p>这里是用于展示富文本回填的模拟内容。</p>`,
    fileName: ``,
    fileUrl: ``,
    creatorName: "管理员A",
    createdAt: `2026-03-15 11:00:00`
  },
  {
    id: 2,
    name: `膳食宝塔分量表`,
    type: 2,
    description:
      "根据平衡膳食宝塔，成年人每天各类食物的建议摄入量（标准人每日摄入）",
    content: `<p>这里是用于展示富文本回填的模拟内容。</p>`,
    fileName: ``,
    fileUrl: ``,
    creatorName: "管理员A",
    createdAt: `2026-03-15 11:00:00`
  },
  {
    id: 3,
    name: `中国居民平衡膳食餐盘`,
    type: 2,
    description:
      "中国居民平衡膳食餐盘（Food Guide Plate）是按照平衡膳食原则，描述了一个人一餐中膳食的食物组成和大致比例。餐盘更加直观，一餐膳食的食物组合搭配轮廓清晰明了。",
    content: `<p>这里是用于展示富文本回填的模拟内容。</p>`,
    fileName: ``,
    fileUrl: ``,
    creatorName: "管理员A",
    createdAt: `2026-03-15 11:00:00`
  },
  {
    id: 4,
    name: `孕期妇女膳食指南`,
    type: 2,
    description:
      "‌《中国居民膳食指南（2022）》为孕期妇女制定了科学、系统的膳食指导，核心是在一般人群平衡膳食基础上，结合孕期特殊营养需求，提出6条关键建议，旨在保障母婴健康、促进胎儿正常发育‌。",
    content: `<p>这里是用于展示富文本回填的模拟内容。</p>`,
    fileName: ``,
    fileUrl: ``,
    creatorName: "管理员C",
    createdAt: `2026-03-15 11:00:00`
  },
  {
    id: 5,
    name: `女性经期膳食建议`,
    type: 2,
    description:
      "‌女性‌月经期间饮食应以温补、易消化为主，注意补充铁和蛋白质，减少生冷、辛辣刺激食物‌。通过合理搭配食物，可缓解经期不适，维持营养均衡。",
    content: `<p>这里是用于展示富文本回填的模拟内容。</p>`,
    fileName: ``,
    fileUrl: ``,
    creatorName: "管理员B",
    createdAt: `2026-03-15 11:00:00`
  }
];

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
      const type = Number(query?.type || 0);

      const filteredList = repositoryList.filter(item => {
        const matchesKeyword = keyword ? item.name.includes(keyword) : true;
        const matchesType = type ? item.type === type : true;
        return matchesKeyword && matchesType;
      });
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
      const repository =
        repositoryList.find(item => item.id === id) ?? repositoryList[0];
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
          target.type = payload.type;
          target.description = payload.description;
          target.content = payload.content;
        }
      } else {
        const nextId =
          repositoryList.length > 0
            ? Math.max(...repositoryList.map(item => item.id)) + 1
            : 1;
        repositoryList.unshift({
          id: nextId,
          name: payload.name,
          type: payload.type,
          description: payload.description,
          content: payload.content,
          fileName: `${Date.now()}.html`,
          fileUrl: `https://example.com/files/repository-${nextId}.html`,
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
