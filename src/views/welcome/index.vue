<script setup lang="ts">
import { computed, markRaw, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import ReCol from "@/components/ReCol";
import { useDark, randomGradient } from "./utils";
import { ReNormalCountTo } from "@/components/ReCountTo";
import { useRenderFlicker } from "@/components/ReFlicker";
import { ChartBar, ChartLine, ChartRound } from "./components/charts";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import {
  getDishCheckData2,
  getDishDynamicsData,
  getIndexStatistics,
  type DishDynamicsItem
} from "@/api/index";
import GroupLine from "~icons/ri/group-line";
import Smile from "~icons/ri/star-smile-line";
import Dish from "~icons/ep/dish";
import Share from "~icons/ep/share";

defineOptions({
  name: "Welcome"
});

interface OverviewCardItem {
  icon: object;
  bgColor: string;
  color: string;
  duration: number;
  name: string;
  value: number;
  percent: string;
  data: number[];
}

interface OverviewBarItem {
  requireData: number[];
  questionData: number[];
}

const { isDark } = useDark();

const loading = ref(false);
const curWeek = ref(1);

const optionsBasis: Array<OptionsType> = [
  {
    label: "上周"
  },
  {
    label: "本周"
  }
];

const chartData = ref<OverviewCardItem[]>([
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "用户数量",
    value: 0,
    percent: "--",
    data: []
  },
  {
    icon: Dish,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "菜谱数量",
    value: 0,
    percent: "--",
    data: []
  },
  {
    icon: Share,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "分享数量",
    value: 0,
    percent: "--",
    data: []
  },
  {
    icon: Smile,
    bgColor: "#f6f4fe",
    color: "#7846e5",
    duration: 300,
    name: "综合评分",
    value: 0,
    percent: "",
    data: [100]
  }
]);

const barChartData = ref<OverviewBarItem[]>([
  {
    requireData: [],
    questionData: []
  },
  {
    requireData: [],
    questionData: []
  }
]);

const latestNewsData = ref<DishDynamicsItem[]>([]);

const timelineList = computed(() => latestNewsData.value.slice(0, 10));

function parsePercentValue(value: string) {
  return Number(String(value).replace("%", "")) || 0;
}

async function loadWelcomeData() {
  loading.value = true;
  try {
    const [statisticsRes, dishCheckRes, dynamicsRes] = await Promise.all([
      getIndexStatistics(),
      getDishCheckData2(),
      getDishDynamicsData()
    ]);

    chartData.value = [
      {
        icon: GroupLine,
        bgColor: "#effaff",
        color: "#41b6ff",
        duration: 2200,
        name: "用户数量",
        value: statisticsRes.data.userStatistics.userTotalCount,
        percent: statisticsRes.data.userStatistics.percentRate,
        data: statisticsRes.data.userStatistics.lastSevenCount
      },
      {
        icon: Dish,
        bgColor: "#fff5f4",
        color: "#e85f33",
        duration: 1600,
        name: "菜谱数量",
        value: statisticsRes.data.dishStatistics.dishTotalCount,
        percent: statisticsRes.data.dishStatistics.percentRate,
        data: statisticsRes.data.dishStatistics.lastSevenCount
      },
      {
        icon: Share,
        bgColor: "#eff8f4",
        color: "#26ce83",
        duration: 1500,
        name: "分享数量",
        value: statisticsRes.data.useShareStatistics.shareTotalCount,
        percent: statisticsRes.data.useShareStatistics.percentRate,
        data: statisticsRes.data.useShareStatistics.lastSevenCount
      },
      {
        icon: Smile,
        bgColor: "#f6f4fe",
        color: "#7846e5",
        duration: 300,
        name: "综合评分",
        value: parsePercentValue(statisticsRes.data.dishTotalScore),
        percent: statisticsRes.data.dishTotalScore,
        data: [parsePercentValue(statisticsRes.data.dishTotalScore)]
      }
    ];

    barChartData.value = [
      {
        requireData: dishCheckRes.data.lastWeekData.aigcDishCount,
        questionData: dishCheckRes.data.lastWeekData.checkDishCount
      },
      {
        requireData: dishCheckRes.data.currentWeekData.aigcDishCount,
        questionData: dishCheckRes.data.currentWeekData.checkDishCount
      }
    ];

    latestNewsData.value = dynamicsRes.data;
  } catch (_error) {
    ElMessage.error("首页统计数据加载失败");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadWelcomeData();
});
</script>

<template>
  <div v-loading="loading">
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in chartData"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="6"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1)
          }
        }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
                height="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                :fontSize="'1.6em'"
                :startVal="0"
                :endVal="item.value"
              />
              <p
                class="font-medium"
                :class="
                  String(item.percent).startsWith('-')
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                {{ item.percent }}
              </p>
            </div>
            <ChartLine
              v-if="item.data.length > 1"
              class="w-1/2!"
              :color="item.color"
              :data="item.data"
            />
            <ChartRound v-else class="w-1/2!" />
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card class="bar-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">分析概览</span>
            <Segmented v-model="curWeek" :options="optionsBasis" />
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartBar
              :requireData="barChartData[curWeek]?.requireData ?? []"
              :questionData="barChartData[curWeek]?.questionData ?? []"
            />
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 640
          }
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">菜谱动态</span>
          </div>
          <el-scrollbar max-height="373" class="mt-3">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in timelineList"
                :key="index"
                center
                placement="top"
                :icon="
                  markRaw(
                    useRenderFlicker({
                      background: randomGradient({
                        randomizeHue: true
                      })
                    })
                  )
                "
                :timestamp="item.day"
              >
                <p class="text-text_color_regular text-sm">
                  {{
                    `AI生成 ${item.aigcCount} 条菜谱，经人工校验${item.checkCount} 条`
                  }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;

  .el-progress--line {
    width: 85%;
  }

  .el-progress-bar__innerText {
    font-size: 15px;
  }

  .el-scrollbar__bar {
    display: none;
  }

  .el-timeline-item {
    margin: 0 6px;
  }
}

:deep(.el-timeline.is-start) {
  padding-left: 0;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
