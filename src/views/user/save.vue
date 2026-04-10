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
  name: "UserSave"
});

interface UserForm {
  userName: string;
  userCode: string;
  password: string;
  age: number | null;
  gender: 1 | 2;
  stature: number | null;
  weight: number | null;
  status: 1 | 2;
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
  userName: "",
  userCode: "",
  password: "",
  age: null,
  gender: 1,
  stature: null,
  weight: null,
  status: 1
});

const rules: FormRules<UserForm> = {
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userCode: [{ required: true, message: "请输入账户", trigger: "blur" }],
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
  stature: [{ required: true, message: "请输入身高", trigger: "change" }],
  weight: [{ required: true, message: "请输入体重", trigger: "change" }],
  status: [{ required: true, message: "请选择用户状态", trigger: "change" }]
};

function fillForm(detail: UserDetail) {
  form.userName = detail.userName;
  form.userCode = detail.userCode;
  form.password = "";
  form.age = detail.age;
  form.gender = detail.gender;
  form.stature = detail.stature;
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
    userName: form.userName,
    userCode: form.userCode,
    age: Number(form.age),
    gender: form.gender,
    stature: Number(form.stature),
    weight: Number(form.weight),
    status: form.status
  };

  if (userId.value) {
    payload.id = userId.value;
  }

  saving.value = true;
  try {
    saveUser(payload).then(e => {
      if (e.success) {
        ElMessage.success(userId.value ? "用户信息修改成功" : "用户新增成功");
        router.push("/user/list");
      } else {
        ElMessage.error(e.message);
      }
    });
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="账户" prop="userCode">
          <el-input v-model="form.userCode" placeholder="请输入账户" />
        </el-form-item>
        <el-form-item v-if="!isEditMode" label="用户密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入用户密码"
          />
        </el-form-item>

        <el-form-item label="用户性别" prop="gender">
          <el-select v-model="form.gender" class="w-full">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="form.age"
            :min="1"
            :max="120"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="身高" prop="stature">
          <el-input-number
            v-model="form.stature"
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
