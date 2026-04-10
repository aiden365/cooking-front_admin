<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  deleteRecipe,
  getRecipeList,
  type RecipeItem,
  type RecipeListParams,
  type RecipeCheckStatus
} from "@/api/recipe";

defineOptions({
  name: "DishList"
});

interface SearchForm {
  search: string;
  checkStatus: RecipeCheckStatus | "";
}

const router = useRouter();
const loading = ref(false);
const recipeList = ref<RecipeItem[]>([]);
const total = ref(0);

const defaultPageSize = 7;

const pagination = reactive({
  pageNo: 1,
  pageSize: defaultPageSize
});

const searchForm = reactive<SearchForm>({
  search: "",
  checkStatus: ""
});

const statusOptions: Array<{
  label: string;
  value: RecipeCheckStatus | "";
}> = [
  { label: "全部状态", value: "" },
  { label: "未校验", value: 1 },
  { label: "已校验", value: 2 }
];

async function loadRecipeList() {
  loading.value = true;
  try {
    const params: RecipeListParams = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      search: searchForm.search.trim(),
      checkStatus: searchForm.checkStatus
    };
    const result = await getRecipeList(params);
    recipeList.value = result.data.records;
    total.value = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNo = 1;
  loadRecipeList();
}

function handleReset() {
  searchForm.search = "";
  searchForm.checkStatus = "";
  pagination.pageNo = 1;
  pagination.pageSize = defaultPageSize;
  loadRecipeList();
}

function handleAdd() {
  router.push("/dish/add");
}

function handleEdit(row: RecipeItem) {
  router.push(`/dish/edit/${row.id}`);
}

function handleDetail(row: RecipeItem) {
  router.push(`/dish/detail/${row.id}`);
}

function handleTag(row: RecipeItem) {
  ElMessage.info(`菜谱「${row.name}」的标签维护页面待实现`);
}

async function handleDelete(row: RecipeItem) {
  await ElMessageBox.confirm(
    `确认删除菜谱「${row.name}」吗？删除后不可恢复。`,
    "删除确认",
    {
      type: "warning",
      confirmButtonText: "确认删除",
      cancelButtonText: "取消"
    }
  );
  await deleteRecipe(row.id);
  ElMessage.success("删除成功");
  const currentPageHasSingleRow =
    recipeList.value.length === 1 && pagination.pageNo > 1;
  if (currentPageHasSingleRow) {
    pagination.pageNo -= 1;
  }
  loadRecipeList();
}

function formatStatus(status: RecipeCheckStatus) {
  return status === 2 ? "已校验" : "未校验";
}

function formatStatusTagType(status: RecipeCheckStatus) {
  return status === 2 ? "success" : "warning";
}

function handleCurrentChange(page: number) {
  pagination.pageNo = page;
  loadRecipeList();
}

onMounted(() => {
  loadRecipeList();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="菜谱名称" class="mb-0!">
          <el-input
            v-model="searchForm.search"
            clearable
            placeholder="请输入菜谱名称"
            class="240px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="校验状态" class="mb-0!">
          <el-select
            v-model="searchForm.checkStatus"
            placeholder="请选择校验状态"
            class="w-[180px]"
            style="width: 150px"
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-0!">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item class="mb-0! ml-auto">
          <el-button type="primary" @click="handleAdd">新增菜谱</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="recipeList"
        stripe
        class="recipe-table"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column
          label="菜名"
          prop="name"
          min-width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <div class="min-w-0">
              <div class="truncate font-medium text-text_color_primary">
                {{ row.name }}
              </div>
              <div class="text-xs text-text_color_regular">
                创建于 {{ row.createTime }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="食材数量"
          prop="materialCount"
          min-width="80"
          align="center"
        />
        <el-table-column
          label="调料数量"
          prop="flavorCount"
          min-width="80"
          align="center"
        />
        <el-table-column
          label="步骤数量"
          prop="stepCount"
          min-width="80"
          align="center"
        />
        <el-table-column label="预计用时" min-width="100" align="center">
          <template #default="{ row }"> {{ row.takeTimes }} </template>
        </el-table-column>
        <el-table-column
          label="浏览量"
          prop="viewCount"
          min-width="70"
          align="center"
        />
        <el-table-column
          label="活跃值"
          prop="activeVal"
          min-width="70"
          align="center"
        />
        <el-table-column
          label="人气值"
          prop="popularVal"
          min-width="70"
          align="center"
        />
        <el-table-column
          label="综合评分"
          prop="totalScore"
          min-width="80"
          align="center"
        />
        <el-table-column label="检查状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="formatStatusTagType(row.checkStatus)" effect="light">
              {{ formatStatus(row.checkStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="标签" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <el-tag v-for="tag in row.tags" :key="tag" effect="plain">
                {{ tag }}
              </el-tag>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          fixed="right"
          min-width="250"
          align="center"
        >
          <template #default="{ row }">
            <div
              class="flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <el-button link type="primary" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button link type="info" @click="handleDetail(row)">
                详情
              </el-button>
              <el-button link type="warning" @click="handleTag(row)">
                标签
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无菜谱数据" />
        </template>
      </el-table>

      <div class="mt-4 flex justify-end overflow-x-auto">
        <el-pagination
          v-model:current-page="pagination.pageNo"
          :page-size="pagination.pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.recipe-table :deep(.el-table__body-wrapper) {
  overflow-x: auto;
}
</style>
