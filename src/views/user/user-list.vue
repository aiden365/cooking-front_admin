<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  getUserList,
  resetUserPassword,
  updateUserStatus,
  type UserListItem,
  type UserListParams
} from "@/api/system";

defineOptions({
  name: "UserList"
});

interface SearchForm {
  keyword: string;
}

interface PasswordForm {
  userId: number | null;
  password: string;
  confirmPassword: string;
}

const router = useRouter();
const loading = ref(false);
const dialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();
const selectedUserName = ref("");
const userList = ref<UserListItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  keyword: ""
});

const passwordForm = reactive<PasswordForm>({
  userId: null,
  password: "",
  confirmPassword: ""
});

const passwordRules: FormRules<PasswordForm> = {
  password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    {
      validator: (_rule, value: string, callback) => {
        if (value !== passwordForm.password) {
          callback(new Error("两次输入的密码不一致"));
          return;
        }
        callback();
      },
      trigger: "blur"
    }
  ]
};

async function loadUserList() {
  loading.value = true;
  try {
    const params: UserListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword.trim()
    };
    const result = await getUserList(params);
    userList.value = result.data.list;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadUserList();
}

function handleEdit(row: UserListItem) {
  router.push(`/user/edit/${row.id}`);
}

function openPasswordDialog(row: UserListItem) {
  selectedUserName.value = row.username;
  passwordForm.userId = row.id;
  passwordForm.password = "";
  passwordForm.confirmPassword = "";
  dialogVisible.value = true;
}

async function savePassword() {
  const valid = await passwordFormRef.value?.validate().catch(() => false);
  if (!valid || passwordForm.userId === null) return;

  await resetUserPassword({
    userId: passwordForm.userId,
    password: passwordForm.password
  });
  dialogVisible.value = false;
  ElMessage.success("密码修改成功");
}

async function toggleStatus(row: UserListItem) {
  const nextStatus = row.status === 1 ? 3 : 1;
  await updateUserStatus({
    userId: row.id,
    status: nextStatus
  });
  ElMessage.success(`已触发${nextStatus === 1 ? "启用" : "禁用"}操作`);
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadUserList();
}

function getStatusLabel(status: 1 | 3) {
  return status === 1 ? "正常" : "禁用";
}

function getStatusTagType(status: 1 | 3) {
  return status === 1 ? "success" : "danger";
}

loadUserList();
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-form inline :model="searchForm" class="flex flex-wrap gap-y-2">
        <el-form-item label="用户姓名" class="mb-0!">
          <el-input
            v-model="searchForm.keyword"
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
        :data="userList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="用户名" prop="username" min-width="140" />
        <el-table-column label="账户" prop="account" min-width="150" />
        <el-table-column label="年龄" prop="age" width="90" align="center" />
        <el-table-column label="性别" prop="gender" width="90" align="center" />
        <el-table-column label="身高(cm)" prop="height" width="110" align="center" />
        <el-table-column label="体重(kg)" prop="weight" width="110" align="center" />
        <el-table-column label="用户状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="registerTime" min-width="180" />
        <el-table-column label="操作" fixed="right" min-width="220" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="warning" @click="openPasswordDialog(row)">修改密码</el-button>
            <el-button link :type="row.status === 1 ? 'danger' : 'success'" @click="toggleStatus(row)">
              {{ row.status === 1 ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无用户数据" />
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

    <el-dialog v-model="dialogVisible" :title="`修改密码 - ${selectedUserName}`" width="520px">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-position="top"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePassword">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
