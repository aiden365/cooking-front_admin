<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  getUserAppraisePage,
  getDishScorePage,
  resetRecipeAppraise,
  deleteAppraises,
  type RecipeAppraiseItem,
  type DishScorePageParams,
  type UserAppraiseItem
} from "@/api/recipe";

defineOptions({
  name: "DishAppraiseList"
});

interface DishSearchForm {
  keyword: string;
}

const loading = ref(false);
const detailLoading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dishScoreList = ref<RecipeAppraiseItem[]>([]);
const userAppraiseList = ref<UserAppraiseItem[]>([]);
const currentDishId = ref(-1);

const dishPagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const appraisesPagination = reactive({
  pageNum: 1,
  pageSize: 5,
  total: 0
});

const searchForm = reactive<DishSearchForm>({
  keyword: ""
});

function getScoreTagType(score: number) {
  if (score >= 1 && score < 2) return "danger";
  if (score >= 2 && score < 4) return "warning";
  return "success";
}

async function loadDishScorePage() {
  loading.value = true;
  try {
    const params: DishScorePageParams = {
      pageNum: dishPagination.pageNum,
      pageSize: dishPagination.pageSize,
      search: searchForm.keyword.trim()
    };
    const result = await getDishScorePage(params);
    dishScoreList.value = result.data.records;
    dishPagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  dishPagination.pageNum = 1;
  loadDishScorePage();
}

async function loadUserAppraisePage() {
  detailLoading.value = true;
  try {
    const result = await getUserAppraisePage({
      dishId: currentDishId.value,
      pageNum: appraisesPagination.pageNum,
      pageSize: appraisesPagination.pageSize
    });
    userAppraiseList.value = result.data.records;
    appraisesPagination.total = result.data.total;
  } finally {
    detailLoading.value = false;
  }
}

async function handleDetail(row: RecipeAppraiseItem) {
  detailLoading.value = true;
  dialogVisible.value = true;
  dialogTitle.value = `${row.dishName} - 用户评价详情`;
  currentDishId.value = row.dishId;
  loadUserAppraisePage();
}

async function handleReset(row: RecipeAppraiseItem) {
  await resetRecipeAppraise(row.dishId);
  ElMessage.success(`已触发「${row.dishName}」评价重置`);
}

async function handleDeleteAppraises(row: RecipeAppraiseItem) {
  deleteAppraises(row.id).then(e => {
    if (e.success) {
      ElMessage.success(`已删除「${row.userName}」的评价`);
      loadUserAppraisePage();
    } else {
      ElMessage.error(`删除「${row.userName}」的评价失败`);
    }
  });
}

function handleDishPageCurrentChange(page: number) {
  dishPagination.pageNum = page;
  loadDishScorePage();
}

function handleAppraisesPageCurrentChange(page: number) {
  appraisesPagination.pageNum = page;
  loadUserAppraisePage();
}

onMounted(() => {
  loadDishScorePage();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="菜品名称" class="mb-0!">
          <el-input
            v-model="searchForm.keyword"
            clearable
            placeholder="请输入菜品名称"
            class="w-[260px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item class="mb-0!">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="dishScoreList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column
          label="菜名"
          prop="dishName"
          min-width="220"
          show-overflow-tooltip
        />
        <el-table-column label="操作性评分" min-width="160" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getScoreTagType(row.manipulationScoreAvg)"
              effect="dark"
            >
              {{ row.manipulationScoreAvg }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="匹配度评分" min-width="160" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.equalScoreAvg)" effect="dark">
              {{ row.equalScoreAvg }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="满意度评分" min-width="160" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getScoreTagType(row.satisfactionScoreAvg)"
              effect="dark"
            >
              {{ row.satisfactionScoreAvg }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)"
              >详情</el-button
            >
<!--            <el-button link type="danger" @click="handleReset(row)"
              >重置</el-button
            >-->
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无评价数据" />
        </template>
      </el-table>

      <div class="mt-4 flex justify-end overflow-x-auto">
        <el-pagination
          v-model:current-page="dishPagination.pageNum"
          :page-size="dishPagination.pageSize"
          :total="dishPagination.total"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleDishPageCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="820px">
      <el-table v-loading="detailLoading" :data="userAppraiseList" border>
        <el-table-column label="用户名" prop="userName" min-width="160" />
        <el-table-column label="操作性评分" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getScoreTagType(row.manipulationScore)"
              effect="plain"
            >
              {{ row.manipulationScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="匹配度评分" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.equalScore)" effect="plain">
              {{ row.equalScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="满意度评分" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getScoreTagType(row.satisfactionScore)"
              effect="plain"
            >
              {{ row.satisfactionScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评价时间" prop="updateTime" min-width="160" />
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDeleteAppraises(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无用户评价" />
        </template>
      </el-table>
      <div class="mt-4 flex justify-end overflow-x-auto">
        <el-pagination
          v-model:current-page="appraisesPagination.pageNum"
          :page-size="appraisesPagination.pageSize"
          :total="appraisesPagination.total"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleAppraisesPageCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>
