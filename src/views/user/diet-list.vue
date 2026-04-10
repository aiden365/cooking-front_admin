<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  deleteUserDiet,
  getUserDietList,
  type UserDietItem,
  type UserDietListParams
} from "@/api/system";

defineOptions({
  name: "UserDietList"
});

interface SearchForm {
  dishName: string;
  userName: string;
  dietDate: string;
  dietOrder: 1 | 2 | 3 | null;
}

const loading = ref(false);
const dietList = ref<UserDietItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  dishName: "",
  userName: "",
  dietOrder: null,
  dietDate: null
});

const dietOrderOptions = [
  { label: "早餐", value: 1 },
  { label: "午餐", value: 2 },
  { label: "晚餐", value: 3 }
] as const;

async function loadDietList() {
  loading.value = true;
  try {
    const params: UserDietListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      dishName: searchForm.dishName.trim(),
      userName: searchForm.userName.trim(),
      dietOrder: searchForm.dietOrder,
      dietDate: searchForm.dietDate
    };
    const result = await getUserDietList(params);
    dietList.value = result.data.records;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadDietList();
}

async function handleDelete(row: UserDietItem) {
  deleteUserDiet(row.id).then(e => {
    if (e.success) {
      ElMessage.success(`删除成功`);
      loadDietList();
    } else {
      ElMessage.error(e.message);
    }
  });
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadDietList();
}

function formatMealTime(dietDate: 1 | 2 | 3) {
  return dietDate === 1 ? "早餐" : dietDate === 2 ? "午餐" : "晚餐";
}

onMounted(() => {
  loadDietList();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="用户姓名" class="mb-0!">
          <el-input
            v-model="searchForm.userName"
            clearable
            placeholder="请输入用户姓名"
            class="w-[220px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="菜品名称" class="mb-0!">
          <el-input
            v-model="searchForm.dishName"
            clearable
            placeholder="请输入菜品名称"
            class="w-[220px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="日期" class="mb-0!">
          <el-date-picker
            v-model="searchForm.dietDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            class="w-[220px]"
          />
        </el-form-item>
        <el-form-item label="餐次" class="mb-0!">
          <el-select
            v-model="searchForm.dietOrder"
            placeholder="请选择餐次"
            class="w-[180px]"
            style="width: 150px"
          >
            <el-option label="全部餐次" value="" />
            <el-option
              v-for="option in dietOrderOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-0!">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="dietList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="用户名" prop="userName" min-width="140" />
        <el-table-column label="菜品" prop="dishName" min-width="180" />
        <el-table-column label="日期" prop="dietDate" min-width="140" />
        <el-table-column label="餐次" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatMealTime(row.dietOrder) }}
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-button link type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无饮食记录" />
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
  </div>
</template>
