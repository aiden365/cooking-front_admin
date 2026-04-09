<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  deleteRepository,
  getRepositoryList,
  type RepositoryItem,
  type RepositoryListParams,
  type RepositoryType
} from "@/api/repository";

defineOptions({
  name: "RepositoryList"
});

interface SearchForm {
  keyword: string;
  type: RepositoryType | "";
}

const router = useRouter();
const loading = ref(false);
const repositoryList = ref<RepositoryItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  keyword: "",
  type: ""
});

async function loadRepositoryList() {
  loading.value = true;
  try {
    const params: RepositoryListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword.trim(),
      type: searchForm.type
    };
    const result = await getRepositoryList(params);
    repositoryList.value = result.data.records;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadRepositoryList();
}

function handleAdd() {
  router.push("/repository/add");
}

function handleEdit(row: RepositoryItem) {
  router.push(`/repository/edit/${row.id}`);
}

async function handleDelete(row: RepositoryItem) {
  await deleteRepository(row.id);
  ElMessage.success(`知识「${row.name}」已删除`);
  loadRepositoryList();
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadRepositoryList();
}

function getTypeLabel(type: RepositoryType) {
  return type === 1 ? "菜谱知识" : "营养知识";
}

function getTypeTagType(type: RepositoryType) {
  return type === 1 ? "success" : "warning";
}

onMounted(() => {
  loadRepositoryList();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="关键字" class="mb-0!">
          <el-input
            v-model="searchForm.keyword"
            clearable
            placeholder="请输入关键字"
            class="w-[260px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="类型" class="mb-0!">
          <el-select
            v-model="searchForm.type"
            clearable
            placeholder="请选择类型"
            style="width: 180px"
          >
            <el-option :value="1" label="菜谱知识" />
            <el-option :value="2" label="营养知识" />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-0!">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
        <el-form-item class="mb-0! ml-auto">
          <el-button type="primary" @click="handleAdd">添加知识</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="repositoryList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="名称" prop="name" min-width="180" />
        <el-table-column label="类型" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)" effect="light">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          min-width="320"
          show-overflow-tooltip
        />
        <!-- <el-table-column label="文件" min-width="220">
          <template #default="{ row }">
            <a
              :href="row.fileUrl"
              class="text-primary hover:underline"
              download
            >
              {{ row.fileName }}
            </a>
          </template>
        </el-table-column> -->
        <el-table-column label="创建人" prop="creatorName" min-width="140" />

        <el-table-column label="创建时间" prop="createdAt" min-width="180" />

        <el-table-column
          label="操作"
          fixed="right"
          min-width="160"
          align="center"
        >
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button link type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无知识数据" />
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
