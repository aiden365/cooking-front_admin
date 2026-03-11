<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  getUserDetail,
  saveUser,
  type UserDetail,
  type UserSavePayload
} from "@/api/system";

defineOptions({
  name: "UserEdit"
});

interface UserForm {
  username: string;
  account: string;
  password: string;
  age: number | null;
  gender: "男" | "女";
  height: number | null;
  weight: number | null;
  status: 1 | 3;
}

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const saving = ref(false);

const userId = computed(() => {
  const rawId = route.params.id;
  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isFinite(parsed) ? parsed : null;
});

const pageTitle = computed(() => (userId.value ? "编辑用户" : "新增用户"));
const isEditMode = computed(() => userId.value !== null);

const form = reactive<UserForm>({
  username: "",
  account: "",
  password: "",
  age: null,
  gender: "男",
  height: null,
  weight: null,
  status: 1
});

const rules: FormRules<UserForm> = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  account: [{ required: true, message: "请输入账户", trigger: "blur" }],
  password: [
    {
      validator: (_rule, value: string, callback) => {
        if (!isEditMode.value && !value.trim()) {
          callback(new Error("请输入用户密码"));
          return;
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  age: [{ required: true, message: "请输入年龄", trigger: "change" }],
  gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
  height: [{ required: true, message: "请输入身高", trigger: "change" }],
  weight: [{ required: true, message: "请输入体重", trigger: "change" }],
  status: [{ required: true, message: "请选择用户状态", trigger: "change" }]
};

function fillForm(detail: UserDetail) {
  form.username = detail.username;
  form.account = detail.account;
  form.password = "";
  form.age = detail.age;
  form.gender = detail.gender;
  form.height = detail.height;
  form.weight = detail.weight;
  form.status = detail.status;
}

async function loadUserDetail() {
  if (!userId.value) return;
  loading.value = true;
  try {
    const result = await getUserDetail(userId.value);
    fillForm(result.data);
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  const payload: UserSavePayload = {
    username: form.username,
    account: form.account,
    age: Number(form.age),
    gender: form.gender,
    height: Number(form.height),
    weight: Number(form.weight),
    status: form.status
  };

  if (userId.value) {
    payload.id = userId.value;
  }

  saving.value = true;
  try {
    await saveUser(payload);
    ElMessage.success(userId.value ? "用户信息修改成功" : "用户新增成功");
    router.push("/user/list");
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadUserDetail();
});
</script>

<template>
  <div class="space-y-4">
    <el-page-header :content="pageTitle" @back="router.push('/user/list')" />

    <el-card v-loading="loading" shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="mx-auto max-w-[760px]"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-model="form.account" placeholder="请输入账户" />
        </el-form-item>
        <el-form-item v-if="!isEditMode" label="用户密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入用户密码"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="form.gender" placeholder="请输入性别" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="form.age"
            :min="1"
            :max="120"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="身高" prop="height">
          <el-input-number
            v-model="form.height"
            :min="50"
            :max="260"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input-number
            v-model="form.weight"
            :min="20"
            :max="300"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="form.status" class="w-full">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="3" />
          </el-select>
        </el-form-item>

        <div class="pt-2 text-right">
          <el-button type="primary" :loading="saving" @click="handleSave"
            >保存</el-button
          >
        </div>
      </el-form>
    </el-card>
  </div>
</template>
