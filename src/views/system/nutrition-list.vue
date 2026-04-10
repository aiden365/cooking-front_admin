<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  deleteSystemNutrition,
  getSystemNutritionDetail,
  getSystemNutritionList,
  saveSystemNutrition,
  type SystemNutritionItem,
  type SystemNutritionListParams
} from "@/api/system";

defineOptions({
  name: "SystemNutritionList"
});

interface SearchForm {
  search: string;
}

interface NutritionForm {
  id?: number;
  name: string;
  defaultValue: string;
}

const loading = ref(false);
const dialogVisible = ref(false);
const dialogLoading = ref(false);
const saveLoading = ref(false);
const formRef = ref<FormInstance>();
const dialogTitle = ref("添加元素");
const nutritionList = ref<SystemNutritionItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  search: ""
});

const nutritionForm = reactive<NutritionForm>({
  name: "",
  defaultValue: ""
});

const rules: FormRules<NutritionForm> = {
  name: [{ required: true, message: "请输入元素名", trigger: "blur" }],
  defaultValue: [{ required: true, message: "请输入推荐值", trigger: "blur" }]
};

async function loadNutritionList() {
  loading.value = true;
  try {
    const params: SystemNutritionListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      search: searchForm.search.trim()
    };
    const result = await getSystemNutritionList(params);
    nutritionList.value = result.data.records;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadNutritionList();
}

function resetForm() {
  nutritionForm.id = undefined;
  nutritionForm.name = "";
  nutritionForm.defaultValue = "";
}

function openAddDialog() {
  dialogTitle.value = "添加元素";
  resetForm();
  dialogVisible.value = true;
}

async function openEditDialog(row: SystemNutritionItem) {
  dialogTitle.value = "编辑元素";
  resetForm();
  dialogLoading.value = true;
  dialogVisible.value = true;
  try {
    const result = await getSystemNutritionDetail(row.id);
    nutritionForm.id = result.data.id;
    nutritionForm.name = result.data.name;
    nutritionForm.defaultValue = result.data.defaultValue;
  } finally {
    dialogLoading.value = false;
  }
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  saveLoading.value = true;
  try {
    await saveSystemNutrition({
      id: nutritionForm.id,
      name: nutritionForm.name.trim(),
      defaultValue: nutritionForm.defaultValue.trim()
    });
    dialogVisible.value = false;
    ElMessage.success(nutritionForm.id ? "元素修改成功" : "元素添加成功");
    loadNutritionList();
  } finally {
    saveLoading.value = false;
  }
}

async function handleDelete(row: SystemNutritionItem) {
  await deleteSystemNutrition(row.id);
  ElMessage.success(`已触发删除操作：${row.name}`);
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadNutritionList();
}

loadNutritionList();
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="元素名称" class="mb-0!">
          <el-input
            v-model="searchForm.search"
            clearable
            placeholder="请输入元素名称"
            class="w-[260px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item class="mb-0!">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
        <el-form-item class="mb-0! ml-auto">
          <el-button type="primary" @click="openAddDialog">添加元素</el-button>
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
        <el-table-column label="营养元素" prop="name" min-width="180" />
        <el-table-column label="默认值" prop="defaultValue" min-width="140" />
        <el-table-column label="创建时间" prop="createTime" min-width="180" />
        <el-table-column label="创建人" prop="creatorName" min-width="140" />
        <el-table-column
          label="操作"
          fixed="right"
          min-width="160"
          align="center"
        >
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)"
              >编辑</el-button
            >
            <el-button link type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无营养元素数据" />
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <div v-loading="dialogLoading">
        <el-form
          ref="formRef"
          :model="nutritionForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="元素名" prop="name">
            <el-input v-model="nutritionForm.name" placeholder="请输入元素名" />
          </el-form-item>
          <el-form-item label="推荐值" prop="defaultValue">
            <el-input
              v-model="nutritionForm.defaultValue"
              placeholder="请输入推荐值"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleSave">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
