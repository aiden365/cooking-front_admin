import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
export interface IndexStatisticsBlock {
  lastSevenCount: number[];
  percentRate: string;
}

export interface UserStatistics extends IndexStatisticsBlock {
  userTotalCount: number;
}

export interface DishStatistics extends IndexStatisticsBlock {
  dishTotalCount: number;
}

export interface UseShareStatistics extends IndexStatisticsBlock {
  shareTotalCount: number;
}

export interface IndexStatisticsData {
  userStatistics: UserStatistics;
  dishStatistics: DishStatistics;
  useShareStatistics: UseShareStatistics;
  dishTotalScore: string;
}

export interface WeekDishCheckData {
  aigcDishCount: number[];
  checkDishCount: number[];
}

export interface DishCheckStatisticsData {
  currentWeekData: WeekDishCheckData;
  lastWeekData: WeekDishCheckData;
}

export interface DishDynamicsItem {
  day: string;
  aigcCount: number;
  checkCount: number;
}

export interface IndexStatisticsResult {
  code: number;
  msg: string;
  data: IndexStatisticsData;
}

export interface DishCheckStatisticsResult {
  code: number;
  msg: string;
  data: DishCheckStatisticsData;
}

export interface DishDynamicsResult {
  code: number;
  msg: string;
  data: DishDynamicsItem[];
}

export const getIndexStatistics = () => {
  return http.request<IndexStatisticsResult>(
    "post",
    baseUrlApi("index/statistics")
  );
};

export const getDishCheckData2 = () => {
  return http.request<DishCheckStatisticsResult>(
    "post",
    baseUrlApi("index/dishCheckData")
  );
};

export const getDishDynamicsData = () => {
  return http.request<DishDynamicsResult>(
    "post",
    baseUrlApi("index/dishDynamicsData")
  );
};
