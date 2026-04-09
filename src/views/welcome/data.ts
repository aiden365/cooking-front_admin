import { dayjs, cloneDeep, getRandomIntBetween } from "./utils";
import GroupLine from "~icons/ri/group-line";
import Smile from "~icons/ri/star-smile-line";
import Dish from "~icons/ep/dish";
import Share from "~icons/ep/share";

const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 需求人数、提问数量、解决数量、用户满意度 */
const chartData = [
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "用户数量",
    value: 18,
    percent: "+88%",
    data: [30, 52, 42, 49, 67, 52, 74] // 平滑折线图数据
  },
  {
    icon: Dish,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "菜谱数量",
    value: 37,
    percent: "+70%",
    data: [16, 11, 55, 38, 21, 73, 79]
  },
  {
    icon: Share,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "分享数量",
    value: 12,
    percent: "+99%",
    data: [8, 10, 31, 17, 36, 24, 45]
  },
  {
    icon: Smile,
    bgColor: "#f6f4fe",
    color: "#7846e5",
    duration: 300,
    name: "综合评分",
    value: 100,
    percent: "+100%",
    data: [100]
  }
];

/** 分析概览 */
const barChartData = [
  {
    requireData: [10, 20, 30, 15, 35, 40, 60],
    questionData: [7, 17, 27, 12, 30, 35, 45]
  },
  {
    requireData: [10, 20, 30, 15, 35, 40, 60],
    questionData: [7, 17, 27, 12, 30, 35, 45]
  }
];

/** 数据统计 */
const tableData = Array.from({ length: 30 }).map((_, index) => {
  return {
    id: index + 1,
    aicgNumber: getRandomIntBetween(30, 50),
    questionNumber: getRandomIntBetween(1260, 1699),
    checkNumber: getRandomIntBetween(10, 30),
    satisfaction: getRandomIntBetween(95, 100),
    date: dayjs().subtract(index, "day").format("YYYY-MM-DD")
  };
});

/** 最新动态 */
const latestNewsData = cloneDeep(tableData)
  .slice(0, 10)
  .map((item, index) => {
    return Object.assign(item, {
      date: `${dayjs().subtract(index, "day").format("YYYY-MM-DD")} ${
        days[dayjs().subtract(index, "day").day()]
      }`
    });
  });

export { chartData, barChartData, tableData, latestNewsData };
