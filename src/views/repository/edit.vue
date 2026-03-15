<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import {
  createEditor,
  createToolbar,
  type IDomEditor,
  type IEditorConfig,
  type IToolbarConfig
} from "@wangeditor/editor";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  getRepositoryDetail,
  saveRepository,
  type RepositoryDetail,
  type RepositorySavePayload,
  type RepositoryType
} from "@/api/repository";

defineOptions({
  name: "RepositoryEdit"
});

interface RepositoryForm {
  name: string;
  type: RepositoryType;
  description: string;
  content: string;
}

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const saving = ref(false);
const toolbarRef = ref<HTMLDivElement | null>(null);
const editorRef = ref<HTMLDivElement | null>(null);
const editor = ref<IDomEditor | null>(null);

const repositoryId = computed(() => {
  const rawId = route.params.id;
  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isFinite(parsed) ? parsed : null;
});

const pageTitle = computed(() =>
  repositoryId.value ? "编辑知识" : "新增知识"
);

const form = reactive<RepositoryForm>({
  name: "",
  type: 1,
  description: "",
  content: ""
});

const rules: FormRules<RepositoryForm> = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  content: [
    {
      validator: (_rule, value: string, callback) => {
        const plainText = value.replace(/<[^>]+>/g, "").trim();
        if (!plainText) {
          callback(new Error("请输入知识内容"));
          return;
        }
        callback();
      },
      trigger: "change"
    }
  ]
};

function fillForm(detail: RepositoryDetail) {
  form.name = detail.name;
  form.type = detail.type;
  form.description = detail.description;
  form.content = detail.content;
  if (editor.value) {
    editor.value.setHtml(detail.content || "<p><br></p>");
  }
}

function initRichEditor() {
  if (!toolbarRef.value || !editorRef.value || editor.value) return;

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入知识内容",
    onChange(currentEditor) {
      form.content = currentEditor.getHtml();
    }
  };
  const toolbarConfig: Partial<IToolbarConfig> = {};

  editor.value = createEditor({
    selector: editorRef.value,
    mode: "default",
    html: form.content || "<p><br></p>",
    config: editorConfig
  });

  createToolbar({
    editor: editor.value,
    selector: toolbarRef.value,
    mode: "default",
    config: toolbarConfig
  });
}

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
    name: form.name.trim(),
    type: form.type,
    description: form.description.trim(),
    content: form.content
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

onMounted(async () => {
  await nextTick();
  initRichEditor();
  loadRepositoryDetail();
});

onBeforeUnmount(() => {
  editor.value?.destroy();
  editor.value = null;
});
</script>

<template>
  <div class="space-y-4">
    <el-page-header
      :content="pageTitle"
      @back="router.push('/repository/list')"
    />

    <el-card v-loading="loading" shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="mx-auto max-w-[920px]"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select
            v-model="form.type"
            class="w-full"
            placeholder="请选择类型"
          >
            <el-option :value="1" label="菜谱知识" />
            <el-option :value="2" label="营养知识" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          />
        </el-form-item>

        <el-form-item label="知识内容" prop="content">
          <div
            class="w-full overflow-hidden rounded-[8px] border border-solid border-[#dcdfe6]"
          >
            <div
              ref="toolbarRef"
              class="border-0 border-b border-solid border-[#ebeef5]"
            />
            <div ref="editorRef" class="max-h-[150px]" />
          </div>
        </el-form-item>

        <div class="pt-2 text-right">
          <el-button type="primary" :loading="saving" @click="handleSave">
            保存
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.w-e-text-container) {
  min-height: 360px;
}
</style>
