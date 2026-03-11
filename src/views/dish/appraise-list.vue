<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  getRecipeAppraiseDetail,
  getRecipeAppraiseList,
  resetRecipeAppraise,
  type RecipeAppraiseItem,
  type RecipeAppraiseListParams,
  type RecipeAppraiseUserItem
} from "@/api/recipe";

defineOptions({
  name: "DishAppraiseList"
});

interface SearchForm {
  keyword: string;
}

const loading = ref(false);
const detailLoading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const appraiseList = ref<RecipeAppraiseItem[]>([]);
const detailList = ref<RecipeAppraiseUserItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  keyword: ""
});

function getScoreTagType(score: number) {
  if (score >= 1 && score < 2) return "danger";
  if (score >= 2 && score < 4) return "warning";
  return "success";
}

async function loadAppraiseList() {
  loading.value = true;
  try {
    const params: RecipeAppraiseListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword.trim()
    };
    const result = await getRecipeAppraiseList(params);
    appraiseList.value = result.data.list;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadAppraiseList();
}

async function handleDetail(row: RecipeAppraiseItem) {
  detailLoading.value = true;
  dialogVisible.value = true;
  dialogTitle.value = `${row.recipeName} - 用户评价详情`;
  try {
    const result = await getRecipeAppraiseDetail(row.recipeId);
    detailList.value = result.data.list;
  } finally {
    detailLoading.value = false;
  }
}

async function handleReset(row: RecipeAppraiseItem) {
  await resetRecipeAppraise(row.recipeId);
  ElMessage.success(`已触发「${row.recipeName}」评价重置`);
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadAppraiseList();
}

onMounted(() => {
  loadAppraiseList();
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
        :data="appraiseList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="菜名" prop="recipeName" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作性评分" min-width="160" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.operationScore)" effect="dark">
              {{ row.operationScore.toFixed(1) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="匹配度评分" min-width="160" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.matchingScore)" effect="dark">
              {{ row.matchingScore.toFixed(1) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="满意度评分" min-width="160" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.satisfactionScore)" effect="dark">
              {{ row.satisfactionScore.toFixed(1) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button link type="danger" @click="handleReset(row)">重置</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无评价数据" />
        </template>
      </el-table>

      <div class="mt-4 flex justify-end overflow-x-auto">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="820px">
      <el-table v-loading="detailLoading" :data="detailList" border>
        <el-table-column label="用户名" prop="username" min-width="160" />
        <el-table-column label="操作性评分" min-width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.operationScore)" effect="plain">
              {{ row.operationScore.toFixed(1) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="匹配度评分" min-width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.matchingScore)" effect="plain">
              {{ row.matchingScore.toFixed(1) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="满意度评分" min-width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.satisfactionScore)" effect="plain">
              {{ row.satisfactionScore.toFixed(1) }}
            </el-tag>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无用户评价" />
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>
