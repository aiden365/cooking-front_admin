<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  addDishLabel,
  deleteRecipe,
  deleteDishLabel,
  getDishLabelList,
  getRecipeList,
  type DishLabelItem,
  type RecipeCheckStatus,
  type RecipeItem,
  type RecipeListParams
} from "@/api/recipe";
import {
  getLabelList,
  type LabelItem,
  type LabelListParams
} from "@/api/label";

defineOptions({
  name: "DishList"
});

interface SearchForm {
  search: string;
  checkStatus: RecipeCheckStatus | "";
}

interface LabelSearchForm {
  labelName: string;
  selectedStatus: "" | "selected" | "unselected";
}

const router = useRouter();
const loading = ref(false);
const tagLoading = ref(false);
const recipeList = ref<RecipeItem[]>([]);
const total = ref(0);
const tagDialogVisible = ref(false);
const currentDish = ref<RecipeItem | null>(null);
const dishLabelList = ref<DishLabelItem[]>([]);
const labelPageList = ref<LabelItem[]>([]);

const defaultPageSize = 7;

const pagination = reactive({
  pageNo: 1,
  pageSize: defaultPageSize
});

const labelPagination = reactive({
  pageNum: 1,
  pageSize: defaultPageSize,
  total: 0
});

const searchForm = reactive<SearchForm>({
  search: "",
  checkStatus: ""
});

const labelSearchForm = reactive<LabelSearchForm>({
  labelName: "",
  selectedStatus: ""
});

const statusOptions: Array<{
  label: string;
  value: RecipeCheckStatus | "";
}> = [
  { label: "全部状态", value: "" },
  { label: "未校验", value: 1 },
  { label: "已校验", value: 2 }
];

const selectedStatusOptions: Array<{
  label: string;
  value: LabelSearchForm["selectedStatus"];
}> = [
  { label: "全部", value: "" },
  { label: "已选择", value: "selected" },
  { label: "未选择", value: "unselected" }
];

const selectedLabelIds = computed(() =>
  dishLabelList.value.map(item => item.id)
);

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

async function loadDishLabels(dishId: number) {
  const result = await getDishLabelList(dishId);
  dishLabelList.value = result.data;
}

function isLabelSelected(labelId: number) {
  return selectedLabelIds.value.includes(labelId);
}

async function loadLabelPageList() {
  tagLoading.value = true;
  try {
    const isUnselectedFilter = labelSearchForm.selectedStatus === "unselected";
    const params: LabelListParams = {
      pageNum: labelPagination.pageNum,
      pageSize: labelPagination.pageSize,
      labelName: labelSearchForm.labelName.trim(),
      type: 2
    };

    if (labelSearchForm.selectedStatus === "selected") {
      params.labelIds = selectedLabelIds.value;
    }
    if (isUnselectedFilter) {
      params.labelIds = null;
      params.excludeLabelIds = selectedLabelIds.value;
    }

    const result = await getLabelList(params);
    let records = result.data.records;
    let totalCount = result.data.total;

    if (isUnselectedFilter) {
      const filteredRecords = records.filter(item => !isLabelSelected(item.id));
      totalCount = filteredRecords.length;
      const startIndex =
        (labelPagination.pageNum - 1) * labelPagination.pageSize;
      records = filteredRecords.slice(
        startIndex,
        startIndex + labelPagination.pageSize
      );
    }

    labelPageList.value = records;
    labelPagination.total = totalCount;
  } finally {
    tagLoading.value = false;
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

async function handleTag(row: RecipeItem) {
  currentDish.value = row;
  tagDialogVisible.value = true;
  labelSearchForm.labelName = "";
  labelSearchForm.selectedStatus = "";
  labelPagination.pageNum = 1;
  labelPagination.pageSize = defaultPageSize;

  tagLoading.value = true;
  try {
    await loadDishLabels(row.id);
    await loadLabelPageList();
  } finally {
    tagLoading.value = false;
  }
}

async function handleLabelSearch() {
  labelPagination.pageNum = 1;
  await loadLabelPageList();
}

async function handleLabelReset() {
  labelSearchForm.labelName = "";
  labelSearchForm.selectedStatus = "";
  labelPagination.pageNum = 1;
  labelPagination.pageSize = defaultPageSize;
  await loadLabelPageList();
}

async function refreshDishLabelData() {
  if (!currentDish.value) return;
  await loadDishLabels(currentDish.value.id);
  await loadLabelPageList();
}

async function handleAddLabel(row: LabelItem) {
  if (!currentDish.value || isLabelSelected(row.id)) return;
  await addDishLabel({
    dishId: currentDish.value.id,
    labelId: row.id
  }).then(e => {
    if (e.success) {
      ElMessage.success("标签添加成功");
    } else {
      ElMessage.error(e.message);
    }
  });

  await refreshDishLabelData();
}

async function handleRemoveLabel(row: LabelItem) {
  if (!currentDish.value || !isLabelSelected(row.id)) return;
  await deleteDishLabel({
    dishId: currentDish.value.id,
    labelId: row.id
  });
  ElMessage.success("标签移除成功");
  await refreshDishLabelData();
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

function handleLabelCurrentChange(page: number) {
  labelPagination.pageNum = page;
  loadLabelPageList();
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

    <el-dialog
      v-model="tagDialogVisible"
      :title="
        currentDish ? `菜谱标签管理 - ${currentDish.name}` : '菜谱标签管理'
      "
      width="900px"
      destroy-on-close
    >
      <div class="space-y-4">
        <el-card shadow="never">
          <el-form
            inline
            :model="labelSearchForm"
            class="flex flex-wrap gap-y-2"
          >
            <el-form-item label="标签名称" class="mb-0!">
              <el-input
                v-model="labelSearchForm.labelName"
                clearable
                placeholder="请输入标签名称"
                class="w-[240px]"
                @keyup.enter="handleLabelSearch"
              />
            </el-form-item>
            <el-form-item label="是否已选" class="mb-0!">
              <el-select
                v-model="labelSearchForm.selectedStatus"
                placeholder="请选择是否已选"
                class="w-[180px]"
                style="width: 160px"
              >
                <el-option
                  v-for="option in selectedStatusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="mb-0!">
              <el-button type="primary" @click="handleLabelSearch">
                搜索
              </el-button>
              <el-button @click="handleLabelReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never">
          <el-table
            v-loading="tagLoading"
            :data="labelPageList"
            stripe
            class="recipe-table"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)',
              fontWeight: '600'
            }"
          >
            <el-table-column
              label="标签名称"
              prop="labelName"
              min-width="260"
              show-overflow-tooltip
            />
            <el-table-column label="是否已选" min-width="120" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="isLabelSelected(row.id) ? 'success' : 'info'"
                  effect="light"
                >
                  {{ isLabelSelected(row.id) ? "已选择" : "未选择" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160" align="center">
              <template #default="{ row }">
                <div class="flex items-center justify-center gap-2">
                  <el-button
                    link
                    type="primary"
                    :disabled="isLabelSelected(row.id)"
                    @click="handleAddLabel(row)"
                  >
                    选择
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    :disabled="!isLabelSelected(row.id)"
                    @click="handleRemoveLabel(row)"
                  >
                    移除
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无标签数据" />
            </template>
          </el-table>

          <div class="mt-4 flex justify-end overflow-x-auto">
            <el-pagination
              v-model:current-page="labelPagination.pageNum"
              :page-size="labelPagination.pageSize"
              :total="labelPagination.total"
              layout="total, prev, pager, next, jumper"
              background
              @current-change="handleLabelCurrentChange"
            />
          </div>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.recipe-table :deep(.el-table__body-wrapper) {
  overflow-x: auto;
}
</style>
