<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  deleteLabel,
  getLabelList,
  saveLabel,
  type LabelItem,
  type LabelListParams
} from "@/api/label";

defineOptions({
  name: "DishLabelList"
});

interface SearchForm {
  search: string;
}

interface LabelForm {
  name: string;
  type: number | null;
}

const loading = ref(false);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const labelList = ref<LabelItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  search: ""
});

const labelForm = reactive<LabelForm>({
  name: "",
  type: null
});

const rules: FormRules<LabelForm> = {
  name: [{ required: true, message: "请输入标签名", trigger: "blur" }],
  type: [{ required: true, message: "请输入序号", trigger: "change" }]
};

async function loadLabelList() {
  loading.value = true;
  try {
    const params: LabelListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      type: 2,
      search: searchForm.search.trim()
    };
    const result = await getLabelList(params);
    labelList.value = result.data.records;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadLabelList();
}

function openDialog() {
  labelForm.name = "";
  labelForm.type = 2;
  dialogVisible.value = true;
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid || labelForm.type === null) return;

  await saveLabel({
    labelName: labelForm.name,
    type: Number(labelForm.type)
  });
  dialogVisible.value = false;
  ElMessage.success("标签添加成功");
  loadLabelList();
}

async function handleDelete(row: LabelItem) {
  await deleteLabel(row.id);
  ElMessage.success(`标签「${row.labelName}」已删除`);
  loadLabelList();
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadLabelList();
}

onMounted(() => {
  loadLabelList();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="标签名" class="mb-0!">
          <el-input
            v-model="searchForm.search"
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
        <!-- <el-table-column
          label="标签序号"
          prop="type"
          min-width="120"
          align="center"
        /> -->
        <el-table-column label="标签名" prop="labelName" min-width="180" />
        <el-table-column label="创建时间" prop="createTime" min-width="180" />
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
      <el-form
        ref="formRef"
        :model="labelForm"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="标签名" prop="name">
          <el-input v-model="labelForm.name" placeholder="请输入标签名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
