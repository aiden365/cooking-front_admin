<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadProps } from "element-plus";
import {
  getRepositoryDetail,
  saveRepository,
  type RepositoryDetail,
  type RepositorySavePayload
} from "@/api/repository";

defineOptions({
  name: "RepositoryEdit"
});

interface RepositoryForm {
  name: string;
  description: string;
  fileName: string;
  fileUrl: string;
}

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const saving = ref(false);

const repositoryId = computed(() => {
  const rawId = route.params.id;
  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isFinite(parsed) ? parsed : null;
});

const pageTitle = computed(() => (repositoryId.value ? "编辑知识" : "新增知识"));

const form = reactive<RepositoryForm>({
  name: "",
  description: "",
  fileName: "",
  fileUrl: ""
});

const rules: FormRules<RepositoryForm> = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  fileName: [{ required: true, message: "请上传文件", trigger: "change" }]
};

function fillForm(detail: RepositoryDetail) {
  form.name = detail.name;
  form.description = detail.description;
  form.fileName = detail.fileName;
  form.fileUrl = detail.fileUrl;
}

const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const isAllowed = rawFile.type === "application/pdf" || rawFile.type === "text/plain";
  if (!isAllowed) {
    ElMessage.error("仅支持上传 PDF 或 txt 文件");
    return false;
  }
  return false;
};

const onFileChange: UploadProps["onChange"] = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return;
  const file = uploadFile.raw;
  const isAllowed = file.type === "application/pdf" || file.type === "text/plain";
  if (!isAllowed) {
    ElMessage.error("仅支持上传 PDF 或 txt 文件");
    return;
  }
  form.fileName = file.name;
  form.fileUrl = URL.createObjectURL(file);
};

async function loadRepositoryDetail() {
  if (!repositoryId.value) return;
  loading.value = true;
  try {
    const result = await getRepositoryDetail(repositoryId.value);
    fillForm(result.data);
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  const payload: RepositorySavePayload = {
    name: form.name,
    description: form.description,
    fileName: form.fileName,
    fileUrl: form.fileUrl
  };

  if (repositoryId.value) {
    payload.id = repositoryId.value;
  }

  saving.value = true;
  try {
    await saveRepository(payload);
    ElMessage.success(repositoryId.value ? "知识修改成功" : "知识添加成功");
    router.push("/repository/list");
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadRepositoryDetail();
});
</script>

<template>
  <div class="space-y-4">
    <el-page-header :content="pageTitle" @back="router.push('/repository/list')" />

    <el-card v-loading="loading" shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="mx-auto max-w-[760px]"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="5"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="文件上传" prop="fileName">
          <el-upload
            class="w-full"
            drag
            :auto-upload="false"
            :show-file-list="false"
            accept=".pdf,.txt"
            :before-upload="beforeUpload"
            :on-change="onFileChange"
          >
            <div class="space-y-2">
              <IconifyIconOnline icon="ep:upload-filled" class="text-[24px] text-primary" />
              <div class="text-sm text-text_color_regular">点击或拖拽上传 PDF / txt 文件</div>
            </div>
          </el-upload>
          <div v-if="form.fileName" class="mt-3 text-sm text-text_color_primary">
            当前文件：{{ form.fileName }}
          </div>
        </el-form-item>

        <div class="pt-2 text-right">
          <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
