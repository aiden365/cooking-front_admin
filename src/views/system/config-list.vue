<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  Connection,
  Key,
  Opportunity,
  Search,
  SetUp,
  Message,
  User
} from "@element-plus/icons-vue";
import {
  getSystemConfigDetail,
  getSystemConfigList,
  saveSystemConfig,
  type SystemConfigCardItem,
  type SystemConfigKey
} from "@/api/system";

defineOptions({
  name: "ConfigList"
});

type ConfigIcon = typeof Key;

interface ConfigCardViewItem extends SystemConfigCardItem {
  icon: ConfigIcon;
}

interface SearchForm {
  keyword: string;
}

interface AiModelForm {
  ApiUrl: string;
  ApiKey: string;
}

interface CountForm {
  maxCount: number;
}

interface NutritionForm {
  nutritionNames: string[];
}

const loading = ref(false);
const dialogVisible = ref(false);
const dialogLoading = ref(false);
const saveLoading = ref(false);
const activeKey = ref<SystemConfigKey | "">("");
const cards = ref<SystemConfigCardItem[]>([]);

const searchForm = reactive<SearchForm>({
  keyword: ""
});

const aiFormRef = ref<FormInstance>();
const countFormRef = ref<FormInstance>();

const aiForm = reactive<AiModelForm>({
  ApiUrl: "",
  ApiKey: ""
});

const countForm = reactive<CountForm>({
  maxCount: 1
});

const nutritionForm = reactive<NutritionForm>({
  nutritionNames: []
});

const iconMap: Record<SystemConfigKey, ConfigIcon> = {
  aiModel: Key,
  maxUserLabels: Opportunity,
  maxUserLoginCount: User,
  maxDishLabels: SetUp,
  nutritionNames: Connection,
  maxNutritionTargets: Opportunity,
  emailConfig: Message
};

const aiRules: FormRules = {
  ApiUrl: [{ required: true, message: "请输入 ApiUrl", trigger: "blur" }],
  ApiKey: [{ required: true, message: "请输入 ApiKey", trigger: "blur" }]
};

const countRules: FormRules = {
  maxCount: [{ required: true, message: "请输入数量", trigger: "change" }]
};

const filteredCards = computed<ConfigCardViewItem[]>(() => {
  const keyword = searchForm.keyword.trim().toLowerCase();
  const source = cards.value.map(item => ({
    ...item,
    icon: iconMap[item.key]
  }));

  if (!keyword) return source;
  return source.filter(item => {
    return (
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  });
});

const dialogTitle = computed(() => {
  const current = cards.value.find(item => item.key === activeKey.value);
  return current ? `编辑${current.name}` : "编辑参数";
});

const isAiDialog = computed(() => activeKey.value === "aiModel");
const isNutritionDialog = computed(() => activeKey.value === "nutritionNames");

async function loadCards() {
  loading.value = true;
  try {
    const result = await getSystemConfigList();
    cards.value = result.data;
  } finally {
    loading.value = false;
  }
}

function resetForms() {
  aiForm.ApiUrl = "";
  aiForm.ApiKey = "";
  countForm.maxCount = 1;
  nutritionForm.nutritionNames = [];
}

async function handleEdit(item: ConfigCardViewItem) {
  activeKey.value = item.key;
  dialogVisible.value = true;
  dialogLoading.value = true;
  resetForms();

  try {
    const result = await getSystemConfigDetail(item.key);
    if (item.key === "aiModel" && result.data.aiModelConfig) {
      aiForm.ApiUrl = result.data.aiModelConfig.ApiUrl;
      aiForm.ApiKey = result.data.aiModelConfig.ApiKey;
    } else if (item.key === "nutritionNames") {
      nutritionForm.nutritionNames = [...(result.data.nutritionNames ?? [])];
    } else {
      countForm.maxCount = result.data.maxCount ?? 1;
    }
  } finally {
    dialogLoading.value = false;
  }
}

function handleDialogClose() {
  dialogVisible.value = false;
  activeKey.value = "";
  resetForms();
}

function addNutritionItem() {
  nutritionForm.nutritionNames.push("");
}

function removeNutritionItem(index: number) {
  nutritionForm.nutritionNames.splice(index, 1);
}

async function handleSave() {
  if (!activeKey.value) return;

  if (activeKey.value === "aiModel") {
    const valid = await aiFormRef.value?.validate().catch(() => false);
    if (!valid) return;
  }

  if (!isAiDialog.value && !isNutritionDialog.value) {
    const valid = await countFormRef.value?.validate().catch(() => false);
    if (!valid) return;
  }

  if (activeKey.value === "nutritionNames") {
    const names = nutritionForm.nutritionNames
      .map(item => item.trim())
      .filter(Boolean);
    if (names.length === 0) {
      ElMessage.warning("请至少保留一个营养参数");
      return;
    }
    nutritionForm.nutritionNames = names;
  }

  saveLoading.value = true;
  try {
    if (activeKey.value === "aiModel") {
      await saveSystemConfig({
        key: activeKey.value,
        aiModelConfig: { ...aiForm }
      });
    } else if (activeKey.value === "nutritionNames") {
      await saveSystemConfig({
        key: activeKey.value,
        nutritionNames: [...nutritionForm.nutritionNames]
      });
    } else {
      await saveSystemConfig({
        key: activeKey.value,
        maxCount: countForm.maxCount
      });
    }

    ElMessage.success("参数保存成功");
    handleDialogClose();
    loadCards();
  } finally {
    saveLoading.value = false;
  }
}

onMounted(() => {
  loadCards();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never" body-class="!p-5">
      <div class="flex justify-end">
        <el-input
          v-model="searchForm.keyword"
          clearable
          placeholder="请输入参数名"
          class="!w-[240px]"
        >
          <template #suffix>
            <el-icon class="text-[16px] text-[#9ca3af]">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
    </el-card>

    <div
      v-loading="loading"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <el-card
        v-for="item in filteredCards"
        :key="item.key"
        shadow="hover"
        body-class="!p-0"
        class="overflow-hidden border-0!"
      >
        <div
          class="flex h-[220px] flex-col justify-between rounded-[10px] bg-white px-9 py-7"
        >
          <div class="flex items-start justify-between gap-4">
            <div
              class="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#dfe9fb]"
            >
              <el-icon class="text-[24px] text-[#1768ff]">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <el-button
              type="success"
              class="!h-[30px] !rounded-[4px] !px-4"
              style="margin-top: 9px; margin-right: -19px"
              @click="handleEdit(item)"
            >
              编辑
            </el-button>
          </div>

          <div class="space-y-3">
            <div class="text-[18px] font-medium leading-[26px] text-[#1f2937]">
              {{ item.name }}
            </div>
            <p
              class="line-clamp-2 text-[14px] leading-[28px] text-[#6b7280]"
              :title="item.description"
            >
              {{ item.description }}
            </p>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty
      v-if="!loading && filteredCards.length === 0"
      description="暂无匹配的参数配置"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="640px"
      destroy-on-close
      @closed="handleDialogClose"
    >
      <div v-loading="dialogLoading">
        <el-form
          v-if="isAiDialog"
          ref="aiFormRef"
          :model="aiForm"
          :rules="aiRules"
          label-width="90px"
        >
          <el-form-item label="ApiUrl" prop="ApiUrl">
            <el-input v-model="aiForm.ApiUrl" placeholder="请输入 ApiUrl" />
          </el-form-item>
          <el-form-item label="ApiKey" prop="ApiKey">
            <el-input v-model="aiForm.ApiKey" placeholder="请输入 ApiKey" />
          </el-form-item>
        </el-form>

        <el-form
          v-else-if="isNutritionDialog"
          label-width="0"
          class="space-y-3"
        >
          <div
            v-for="(item, index) in nutritionForm.nutritionNames"
            :key="`${index}-${item}`"
            class="flex items-center gap-3"
          >
            <el-input
              v-model="nutritionForm.nutritionNames[index]"
              placeholder="请输入营养参数名称"
            />
            <el-button
              type="danger"
              plain
              :disabled="nutritionForm.nutritionNames.length <= 1"
              @click="removeNutritionItem(index)"
            >
              删除
            </el-button>
          </div>
          <el-button type="primary" plain @click="addNutritionItem">
            新增参数
          </el-button>
        </el-form>

        <el-form
          v-else
          ref="countFormRef"
          :model="countForm"
          :rules="countRules"
          label-width="120px"
        >
          <el-form-item label="数量上限" prop="maxCount">
            <el-input-number
              v-model="countForm.maxCount"
              :min="1"
              :max="99"
              controls-position="right"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="handleSave">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
