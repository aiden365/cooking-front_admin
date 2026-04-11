import { defineFakeRoute } from "vite-plugin-fake-server/client";

const statisticsData = {
  userStatistics: {
    userTotalCount: 120,
    lastSevenCount: [1, 3, 2, 4, 5, 2, 6],
    percentRate: "200%"
  },
  dishStatistics: {
    dishTotalCount: 58,
    lastSevenCount: [0, 1, 0, 2, 1, 3, 2],
    percentRate: "-33.33%"
  },
  useShareStatistics: {
    shareTotalCount: 33,
    lastSevenCount: [1, 1, 2, 0, 1, 2, 4],
    percentRate: "100%"
  },
  dishTotalScore: "84%"
};

const dishCheckData = {
  currentWeekData: {
    aigcDishCount: [3, 2, 5, 1, 0, 4, 2],
    checkDishCount: [1, 1, 3, 2, 0, 2, 1]
  },
  lastWeekData: {
    aigcDishCount: [2, 1, 4, 0, 1, 2, 3],
    checkDishCount: [0, 1, 2, 1, 1, 1, 0]
  }
};

const dishDynamicsData = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  return {
    day: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
    aigcCount: [3, 1, 5, 2, 4, 0, 6, 2, 3, 1][index % 10],
    checkCount: [2, 0, 3, 1, 2, 0, 4, 1, 2, 1][index % 10]
  };
});

export default defineFakeRoute([
  {
    url: "/index/statistics",
    method: "post",
    response: () => ({
      code: 200,
      msg: "success",
      data: statisticsData
    })
  },
  {
    url: "/index/dishCheckData",
    method: "post",
    response: () => ({
      code: 200,
      msg: "success",
      data: dishCheckData
    })
  },
  {
    url: "/index/dishDynamicsData",
    method: "post",
    response: () => ({
      code: 200,
      msg: "success",
      data: dishDynamicsData
    })
  }
]);
