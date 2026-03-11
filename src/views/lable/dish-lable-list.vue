<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  deleteDishLabel,
  getDishLabelList,
  saveDishLabel,
  type DishLabelItem,
  type DishLabelListParams
} from "@/api/label";

defineOptions({
  name: "DishLableList"
});

interface SearchForm {
  keyword: string;
}

interface LabelForm {
  name: string;
  sort: number | null;
}

const loading = ref(false);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const labelList = ref<DishLabelItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  keyword: ""
});

const labelForm = reactive<LabelForm>({
  name: "",
  sort: null
});

const rules: FormRules<LabelForm> = {
  name: [{ required: true, message: "请输入标签名", trigger: "blur" }],
  sort: [{ required: true, message: "请输入序号", trigger: "change" }]
};

async function loadDishLabelList() {
  loading.value = true;
  try {
    const params: DishLabelListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword.trim()
    };
    const result = await getDishLabelList(params);
    labelList.value = result.data.list;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadDishLabelList();
}

function openDialog() {
  labelForm.name = "";
  labelForm.sort = null;
  dialogVisible.value = true;
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid || labelForm.sort === null) return;

  await saveDishLabel({
    name: labelForm.name,
    sort: Number(labelForm.sort)
  });
  dialogVisible.value = false;
  ElMessage.success("标签添加成功");
  loadDishLabelList();
}

async function handleDelete(row: DishLabelItem) {
  await deleteDishLabel(row.id);
  ElMessage.success(`标签「${row.name}」已删除`);
  loadDishLabelList();
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadDishLabelList();
}

onMounted(() => {
  loadDishLabelList();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="标签名" class="mb-0!">
          <el-input
            v-model="searchForm.keyword"
            clearable
            placeholder="请输入标签名"
            class="w-[260px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item class="mb-0!">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
        <el-form-item class="mb-0! ml-auto">
          <el-button type="primary" @click="openDialog">添加标签</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="labelList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="标签序号" prop="sort" min-width="120" align="center" />
        <el-table-column label="标签名" prop="name" min-width="180" />
        <el-table-column label="创建时间" prop="createdAt" min-width="180" />
        <el-table-column label="操作" fixed="right" min-width="120" align="center">
          <template #default="{ row }">
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无菜谱标签数据" />
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

    <el-dialog v-model="dialogVisible" title="添加菜谱标签" width="520px">
      <el-form ref="formRef" :model="labelForm" :rules="rules" label-position="top">
        <el-form-item label="标签名" prop="name">
          <el-input v-model="labelForm.name" placeholder="请输入标签名" />
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input-number v-model="labelForm.sort" :min="1" class="w-full" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
