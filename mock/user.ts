import { defineFakeRoute } from "vite-plugin-fake-server/client";

interface UserItem {
  id: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  height: number;
  weight: number;
  status: 1 | 3;
  registerTime: string;
}

interface UserSaveBody {
  id?: number;
  username: string;
  account: string;
  age: number;
  gender: "男" | "女";
  height: number;
  weight: number;
  status: 1 | 3;
}

const userNames = [
  "王小满",
  "李晓彤",
  "陈一诺",
  "赵安安",
  "刘晨",
  "孙嘉禾",
  "周知许",
  "吴可可",
  "郑雨桐",
  "何书言",
  "Mia",
  "Tom"
];

const userList: UserItem[] = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  username: userNames[index % userNames.length],
  account: `user_${String(index + 1).padStart(3, "0")}`,
  age: 20 + (index % 15),
  gender: index % 2 === 0 ? "女" : "男",
  height: 158 + (index % 18),
  weight: 45 + (index % 20),
  status: index % 5 === 0 ? 3 : 1,
  registerTime: `2026-02-${String((index % 28) + 1).padStart(2, "0")} 10:${String(index % 60).padStart(2, "0")}:00`
}));

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default defineFakeRoute([
  {
    url: "/system/user/list",
    method: "get",
    response: ({ query }) => {
      const pageNum = parseNumber(query?.pageNum, 1);
      const pageSize = parseNumber(query?.pageSize, 7);
      const keyword = String(query?.keyword ?? "").trim();

      const filteredList = userList.filter(item =>
        keyword ? item.username.includes(keyword) : true
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
    url: "/system/user/detail",
    method: "get",
    response: ({ query }) => {
      const userId = Number(query?.userId);
      const user = userList.find(item => item.id === userId) ?? userList[0];
      const { registerTime: _registerTime, ...detail } = user;
      return {
        success: true,
        code: 200,
        data: detail,
        message: "请求成功"
      };
    }
  },
  {
    url: "/system/user/save",
    method: "post",
    response: ({ body }) => {
      const payload = body as UserSaveBody;
      if (payload.id) {
        const target = userList.find(item => item.id === payload.id);
        if (target) {
          target.username = payload.username;
          target.account = payload.account;
          target.age = payload.age;
          target.gender = payload.gender;
          target.height = payload.height;
          target.weight = payload.weight;
          target.status = payload.status;
        }
      } else {
        const nextId = userList.length > 0 ? Math.max(...userList.map(item => item.id)) + 1 : 1;
        userList.unshift({
          id: nextId,
          username: payload.username,
          account: payload.account,
          age: payload.age,
          gender: payload.gender,
          height: payload.height,
          weight: payload.weight,
          status: payload.status,
          registerTime: new Date().toISOString().slice(0, 19).replace("T", " ")
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
    url: "/system/user/reset-password",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "密码修改成功"
      };
    }
  },
  {
    url: "/system/user/update-status",
    method: "post",
    response: () => {
      return {
        success: true,
        code: 200,
        data: null,
        message: "状态更新成功"
      };
    }
  }
]);
