<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  deleteUserShare,
  getUserShareList,
  type UserShareItem,
  type UserShareListParams
} from "@/api/system";

defineOptions({
  name: "UserShareList"
});

interface SearchForm {
  dishName: string;
  userName: string;
}

const loading = ref(false);
const detailLoading = ref(false);
const dialogVisible = ref(false);
const shareList = ref<UserShareItem[]>([]);
const shareDetail = ref<UserShareItem | null>(null);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  dishName: "",
  userName: ""
});

async function loadShareList() {
  loading.value = true;
  try {
    const params: UserShareListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      dishName: searchForm.dishName.trim(),
      userName: searchForm.userName.trim()
    };
    const result = await getUserShareList(params);
    shareList.value = result.data.records;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadShareList();
}

async function handleDetail(row: UserShareItem) {
  detailLoading.value = true;
  dialogVisible.value = true;
  try {
    shareDetail.value = row;
  } finally {
    detailLoading.value = false;
  }
}

async function handleDelete(row: UserShareItem) {
  await deleteUserShare(row.id);
  ElMessage.success(`已触发「${row.userName}」分享记录删除`);
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadShareList();
}

onMounted(() => {
  loadShareList();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="菜品名称" class="mb-0!">
          <el-input
            v-model="searchForm.dishName"
            clearable
            placeholder="请输入菜品名称"
            class="w-[260px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="用户姓名" class="mb-0!">
          <el-input
            v-model="searchForm.userName"
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
        :data="shareList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="用户名" prop="userName" min-width="140" />
        <el-table-column label="菜品" prop="dishName" min-width="160" />
        <el-table-column
          label="描述"
          prop="description"
          min-width="320"
          show-overflow-tooltip
          class-name="no-tooltip"
        />
        <el-table-column
          label="操作"
          fixed="right"
          min-width="160"
          align="center"
        >
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)"
              >详情</el-button
            >
            <el-button link type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无分享记录" />
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

    <el-dialog v-model="dialogVisible" title="分享详情" width="720px">
      <el-form v-loading="detailLoading" label-position="top">
        <el-form-item label="菜品名">
          <el-input :model-value="shareDetail?.dishName ?? ''" readonly />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            :model-value="shareDetail?.description ?? ''"
            type="textarea"
            :rows="4"
            readonly
          />
        </el-form-item>
        <el-form-item label="分享图片预览">
          <div v-if="shareDetail" class="space-y-3">
<!--            <div class="text-sm text-text_color_regular">
              {{ shareDetail.dishImg }}
            </div>-->
            <el-image
              :src="shareDetail.dishImg"
              fit="cover"
              class="h-[220px] w-[320px] rounded-lg border border-solid border-[#dcdfe6]"
              :preview-src-list="[shareDetail.dishImg]"
              preview-teleported
            />
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.no-tooltip) {
  pointer-events: none;
}
</style>
