<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  getAdminDetail,
  getAdminList,
  resetAdminPassword,
  saveAdmin,
  updateAdminStatus,
  type AdminListItem,
  type AdminListParams
} from "@/api/system";

defineOptions({
  name: "AdminList"
});

interface SearchForm {
  username: string;
  status: 1 | 2 | 3 | "";
}

interface AdminForm {
  id?: number;
  username: string;
  account: string;
  age: number | null;
  gender: "男" | "女";
}

interface PasswordForm {
  adminId: number | null;
  password: string;
  confirmPassword: string;
}

const loading = ref(false);
const adminDialogVisible = ref(false);
const passwordDialogVisible = ref(false);
const adminFormLoading = ref(false);
const saveLoading = ref(false);
const adminFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const dialogTitle = ref("新增管理员");
const selectedAdminName = ref("");
const adminList = ref<AdminListItem[]>([]);

const pagination = reactive({
  pageNum: 1,
  pageSize: 7,
  total: 0
});

const searchForm = reactive<SearchForm>({
  username: "",
  status: ""
});

const adminForm = reactive<AdminForm>({
  username: "",
  account: "",
  age: null,
  gender: "男"
});

const passwordForm = reactive<PasswordForm>({
  adminId: null,
  password: "",
  confirmPassword: ""
});

const adminRules: FormRules<AdminForm> = {
  username: [{ required: true, message: "请输入管理员姓名", trigger: "blur" }],
  account: [{ required: true, message: "请输入账户", trigger: "blur" }],
  age: [{ required: true, message: "请输入年龄", trigger: "change" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }]
};

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

async function loadAdminList() {
  loading.value = true;
  try {
    const params: AdminListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      username: searchForm.username.trim(),
      status: searchForm.status
    };
    const result = await getAdminList(params);
    adminList.value = result.data.list;
    pagination.total = result.data.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.pageNum = 1;
  loadAdminList();
}

function resetAdminForm() {
  adminForm.id = undefined;
  adminForm.username = "";
  adminForm.account = "";
  adminForm.age = null;
  adminForm.gender = "男";
}

function openAddDialog() {
  dialogTitle.value = "新增管理员";
  resetAdminForm();
  adminDialogVisible.value = true;
}

async function openEditDialog(row: AdminListItem) {
  dialogTitle.value = "编辑管理员";
  resetAdminForm();
  adminFormLoading.value = true;
  adminDialogVisible.value = true;
  try {
    const result = await getAdminDetail(row.id);
    adminForm.id = row.id;
    adminForm.username = result.data.username;
    adminForm.account = result.data.account;
    adminForm.age = result.data.age;
    adminForm.gender = result.data.gender;
  } finally {
    adminFormLoading.value = false;
  }
}

async function saveAdminForm() {
  const valid = await adminFormRef.value?.validate().catch(() => false);
  if (!valid || adminForm.age === null) return;

  saveLoading.value = true;
  try {
    await saveAdmin({
      id: adminForm.id,
      username: adminForm.username.trim(),
      account: adminForm.account.trim(),
      age: adminForm.age,
      gender: adminForm.gender
    });
    adminDialogVisible.value = false;
    ElMessage.success("管理员保存成功");
    loadAdminList();
  } finally {
    saveLoading.value = false;
  }
}

function openPasswordDialog(row: AdminListItem) {
  selectedAdminName.value = row.username;
  passwordForm.adminId = row.id;
  passwordForm.password = "";
  passwordForm.confirmPassword = "";
  passwordDialogVisible.value = true;
}

async function savePassword() {
  const valid = await passwordFormRef.value?.validate().catch(() => false);
  if (!valid || passwordForm.adminId === null) return;

  await resetAdminPassword({
    adminId: passwordForm.adminId,
    password: passwordForm.password
  });
  passwordDialogVisible.value = false;
  ElMessage.success("密码修改成功");
}

async function toggleStatus(row: AdminListItem) {
  const nextStatus = row.status === 1 ? 3 : 1;
  await updateAdminStatus({
    adminId: row.id,
    status: nextStatus
  });
  ElMessage.success(`已触发${nextStatus === 1 ? "启用" : "禁用"}操作`);
}

function handleCurrentChange(page: number) {
  pagination.pageNum = page;
  loadAdminList();
}

function getStatusLabel(status: 1 | 2 | 3) {
  if (status === 1) return "正常";
  if (status === 2) return "待审核";
  return "禁用";
}

function getStatusTagType(status: 1 | 2 | 3) {
  if (status === 1) return "success";
  if (status === 2) return "warning";
  return "danger";
}

loadAdminList();
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
            class="w-[240px]"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="用户状态" class="mb-0!">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择用户状态"
            class="w-[180px]"
          >
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="待审核" />
            <el-option :value="3" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-0!">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
        <el-form-item class="mb-0! ml-auto">
          <el-button type="primary" @click="openAddDialog">添加管理员</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="adminList"
        stripe
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
          fontWeight: '600'
        }"
      >
        <el-table-column label="管理员姓名" prop="username" min-width="160" />
        <el-table-column label="账户" prop="account" min-width="170" />
        <el-table-column label="年龄" prop="age" width="90" align="center" />
        <el-table-column label="性别" prop="gender" width="90" align="center" />
        <el-table-column label="用户状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="registerTime" min-width="180" />
        <el-table-column label="操作" fixed="right" min-width="240" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button link type="warning" @click="openPasswordDialog(row)">修改密码</el-button>
            <el-button
              link
              :type="row.status === 1 ? 'danger' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === 1 ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无管理员数据" />
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

    <el-dialog v-model="adminDialogVisible" :title="dialogTitle" width="520px">
      <div v-loading="adminFormLoading">
        <el-form
          ref="adminFormRef"
          :model="adminForm"
          :rules="adminRules"
          label-position="top"
        >
          <el-form-item label="管理员姓名" prop="username">
            <el-input v-model="adminForm.username" placeholder="请输入管理员姓名" />
          </el-form-item>
          <el-form-item label="账户" prop="account">
            <el-input v-model="adminForm.account" placeholder="请输入账户" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number
              v-model="adminForm.age"
              :min="18"
              :max="99"
              controls-position="right"
              class="w-full"
            />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="adminForm.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="adminDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="saveAdminForm">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="passwordDialogVisible"
      :title="`修改密码 - ${selectedAdminName}`"
      width="520px"
    >
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
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePassword">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
