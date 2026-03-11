<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  deleteUserNutritionTarget,
  getNutritionNameConfig,
  getUserNutritionList,
  getUserNutritionTargets,
  saveUserNutritionTarget,
  type UserNutritionItem,
  type UserNutritionListParams,
  type UserNutritionTargetItem
} from "@/api/system";

defineOptions({
  name: "UserNutritionList"
});

interface SearchForm {
  username: string;
}

const loading = ref(false);
const detailLoading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const nutritionList = ref<UserNutritionItem[]>([]);
const nutritionTargets = ref<UserNutritionTargetItem[]>([]);
const nutritionNameOptions = ref<string[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  username: ""
});

async function loadNutritionList() {
  loading.value = true;
  try {
    const params: UserNutritionListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      username: searchForm.username.trim()
    };
    const result = await getUserNutritionList(params);
    nutritionList.value = result.data.list;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

async function loadNutritionNames() {
  const result = await getNutritionNameConfig();
  nutritionNameOptions.value = result.data;
}

function handleSearch() {
  pagination.pageNum = 1;
  loadNutritionList();
}

async function handleDetail(row: UserNutritionItem) {
  detailLoading.value = true;
  dialogVisible.value = true;
  dialogTitle.value = `${row.username} - 营养目标`;
  try {
    const result = await getUserNutritionTargets(row.id);
    nutritionTargets.value = result.data.list.map(item => ({ ...item }));
  } finally {
    detailLoading.value = false;
  }
}

async function handleSaveTarget(row: UserNutritionTargetItem) {
  await saveUserNutritionTarget({
    id: row.id,
    nutritionName: row.nutritionName,
    targetValue: row.targetValue
  });
  ElMessage.success("营养目标已保存");
}

async function handleDeleteTarget(row: UserNutritionTargetItem) {
  await deleteUserNutritionTarget(row.id);
  nutritionTargets.value = nutritionTargets.value.filter(
    item => item.id !== row.id
  );
  ElMessage.success("营养目标已删除");
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadNutritionList();
}

onMounted(() => {
  loadNutritionNames();
  loadNutritionList();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="用户姓名" class="mb-0!">
          <el-input
            v-model="searchForm.username"
            clearable
            placeholder="请输入用户姓名"
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
        :data="nutritionList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="用户名" prop="username" min-width="140" />

        <el-table-column
          label="性别"
          prop="gender"
          min-width="100"
          align="center"
        />
        <el-table-column
          label="年龄"
          prop="age"
          min-width="100"
          align="center"
        />
        <el-table-column
          label="身高"
          prop="height"
          min-width="100"
          align="center"
        />
        <el-table-column
          label="体重"
          prop="weight"
          min-width="100"
          align="center"
        />
        <el-table-column
          label="营养数量(数)"
          prop="nutritionCount"
          min-width="130"
          align="center"
        />
        <el-table-column
          label="操作"
          fixed="right"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无营养计划数据" />
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="760px">
      <el-table v-loading="detailLoading" :data="nutritionTargets" border>
        <el-table-column label="营养名称" min-width="220">
          <template #default="{ row }">
            <el-select v-model="row.nutritionName" class="w-full">
              <el-option
                v-for="option in nutritionNameOptions"
                :key="option"
                :label="option"
                :value="option"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="目标值" min-width="180">
          <template #default="{ row }">
            <el-input v-model="row.targetValue" placeholder="请输入目标值" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="160" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleSaveTarget(row)"
              >保存</el-button
            >
            <el-button link type="danger" @click="handleDeleteTarget(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无营养目标" />
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>
