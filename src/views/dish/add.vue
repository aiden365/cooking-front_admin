<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadProps } from "element-plus";
import {
  createRecipe,
  type CreateRecipePayload,
  type RecipeIngredientItem,
  type RecipeSeasoningItem,
  type RecipeStepItem
} from "@/api/recipe";

defineOptions({
  name: "DishAdd"
});

interface DishInfoForm {
  name: string;
  durationMinutes: string;
  tips: string;
  cover: string;
}

interface SeasoningDialogForm {
  id: number | null;
  name: string;
  dosage: string;
}

interface IngredientDialogForm {
  id: number | null;
  name: string;
  dosage: string;
  preparation: string;
}

interface StepDialogForm {
  id: number | null;
  order: number | null;
  description: string;
  sampleImage: string;
}

interface PagedSectionState {
  keyword: string;
  pageNum: number;
  pageSize: number;
}

const router = useRouter();
const activeStep = ref(0);
const submitting = ref(false);
const dishInfoFormRef = ref<FormInstance>();

const stepTitles = ["菜品信息", "调料信息", "食材信息", "制作步骤", "完成"];
const fixedPageSize = 5;

const dishInfoForm = reactive<DishInfoForm>({
  name: "",
  durationMinutes: "",
  tips: "",
  cover: ""
});

const dishInfoRules: FormRules<DishInfoForm> = {
  name: [{ required: true, message: "请输入菜品名称", trigger: "blur" }],
  durationMinutes: [
    { required: true, message: "请输入预计用时", trigger: "blur" },
    {
      validator: (_rule, value: string, callback) => {
        const minutes = Number(value);
        if (!Number.isFinite(minutes) || minutes <= 0) {
          callback(new Error("预计用时需为大于 0 的数字"));
          return;
        }
        callback();
      },
      trigger: "blur"
    }
  ]
};

const seasoningState = reactive<PagedSectionState>({
  keyword: "",
  pageNum: 1,
  pageSize: fixedPageSize
});
const ingredientState = reactive<PagedSectionState>({
  keyword: "",
  pageNum: 1,
  pageSize: fixedPageSize
});
const recipeStepState = reactive<PagedSectionState>({
  keyword: "",
  pageNum: 1,
  pageSize: fixedPageSize
});

const seasonings = ref<RecipeSeasoningItem[]>([]);
const ingredients = ref<RecipeIngredientItem[]>([]);
const recipeSteps = ref<RecipeStepItem[]>([]);

const seasoningDialogVisible = ref(false);
const ingredientDialogVisible = ref(false);
const recipeStepDialogVisible = ref(false);

const seasoningDialogForm = reactive<SeasoningDialogForm>({
  id: null,
  name: "",
  dosage: ""
});
const ingredientDialogForm = reactive<IngredientDialogForm>({
  id: null,
  name: "",
  dosage: "",
  preparation: ""
});
const recipeStepDialogForm = reactive<StepDialogForm>({
  id: null,
  order: null,
  description: "",
  sampleImage: ""
});

const seasoningDialogRef = ref<FormInstance>();
const ingredientDialogRef = ref<FormInstance>();
const recipeStepDialogRef = ref<FormInstance>();

const seasoningDialogRules: FormRules<SeasoningDialogForm> = {
  name: [{ required: true, message: "请输入调料名", trigger: "blur" }],
  dosage: [{ required: true, message: "请输入用量", trigger: "blur" }]
};

const ingredientDialogRules: FormRules<IngredientDialogForm> = {
  name: [{ required: true, message: "请输入食材名", trigger: "blur" }],
  dosage: [{ required: true, message: "请输入用量", trigger: "blur" }],
  preparation: [{ required: true, message: "请输入处理方式", trigger: "blur" }]
};

const recipeStepDialogRules: FormRules<StepDialogForm> = {
  order: [
    { required: true, message: "请输入步骤序号", trigger: "blur" },
    {
      validator: (_rule, value: number | null, callback) => {
        if (!value || value <= 0) {
          callback(new Error("步骤序号需大于 0"));
          return;
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  sampleImage: [{ required: true, message: "请输入示例图片", trigger: "blur" }]
};

const filteredSeasonings = computed(() => {
  const keyword = seasoningState.keyword.trim();
  return keyword
    ? seasonings.value.filter(item => item.name.includes(keyword))
    : seasonings.value;
});
const filteredIngredients = computed(() => {
  const keyword = ingredientState.keyword.trim();
  return keyword
    ? ingredients.value.filter(item => item.name.includes(keyword))
    : ingredients.value;
});
const filteredRecipeSteps = computed(() => {
  const keyword = recipeStepState.keyword.trim();
  return keyword
    ? recipeSteps.value.filter(
        item =>
          item.description.includes(keyword) || String(item.order).includes(keyword)
      )
    : recipeSteps.value;
});

const pagedSeasonings = computed(() => {
  const start = (seasoningState.pageNum - 1) * seasoningState.pageSize;
  return filteredSeasonings.value.slice(start, start + seasoningState.pageSize);
});
const pagedIngredients = computed(() => {
  const start = (ingredientState.pageNum - 1) * ingredientState.pageSize;
  return filteredIngredients.value.slice(start, start + ingredientState.pageSize);
});
const pagedRecipeSteps = computed(() => {
  const start = (recipeStepState.pageNum - 1) * recipeStepState.pageSize;
  return filteredRecipeSteps.value.slice(start, start + recipeStepState.pageSize);
});

const seasoningDialogTitle = computed(() =>
  seasoningDialogForm.id ? "编辑调料" : "添加调料"
);
const ingredientDialogTitle = computed(() =>
  ingredientDialogForm.id ? "编辑食材" : "添加食材"
);
const recipeStepDialogTitle = computed(() =>
  recipeStepDialogForm.id ? "编辑制作步骤" : "添加制作步骤"
);

const onCoverChange: UploadProps["onChange"] = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return;
  dishInfoForm.cover = URL.createObjectURL(uploadFile.raw);
};

function resetSeasoningDialogForm() {
  seasoningDialogForm.id = null;
  seasoningDialogForm.name = "";
  seasoningDialogForm.dosage = "";
}

function resetIngredientDialogForm() {
  ingredientDialogForm.id = null;
  ingredientDialogForm.name = "";
  ingredientDialogForm.dosage = "";
  ingredientDialogForm.preparation = "";
}

function resetRecipeStepDialogForm() {
  recipeStepDialogForm.id = null;
  recipeStepDialogForm.order = null;
  recipeStepDialogForm.description = "";
  recipeStepDialogForm.sampleImage = "";
}

function resetPageWhenNeeded<T>(list: T[], state: PagedSectionState) {
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  if (state.pageNum > totalPages) {
    state.pageNum = totalPages;
  }
}

function openSeasoningDialog(item?: RecipeSeasoningItem) {
  if (item) {
    seasoningDialogForm.id = item.id;
    seasoningDialogForm.name = item.name;
    seasoningDialogForm.dosage = item.dosage;
  } else {
    resetSeasoningDialogForm();
  }
  seasoningDialogVisible.value = true;
}

function openIngredientDialog(item?: RecipeIngredientItem) {
  if (item) {
    ingredientDialogForm.id = item.id;
    ingredientDialogForm.name = item.name;
    ingredientDialogForm.dosage = item.dosage;
    ingredientDialogForm.preparation = item.preparation;
  } else {
    resetIngredientDialogForm();
  }
  ingredientDialogVisible.value = true;
}

function openRecipeStepDialog(item?: RecipeStepItem) {
  if (item) {
    recipeStepDialogForm.id = item.id;
    recipeStepDialogForm.order = item.order;
    recipeStepDialogForm.description = item.description;
    recipeStepDialogForm.sampleImage = item.sampleImage;
  } else {
    resetRecipeStepDialogForm();
  }
  recipeStepDialogVisible.value = true;
}

async function saveSeasoning() {
  const valid = await seasoningDialogRef.value?.validate().catch(() => false);
  if (!valid) return;

  if (seasoningDialogForm.id) {
    const target = seasonings.value.find(item => item.id === seasoningDialogForm.id);
    if (target) {
      target.name = seasoningDialogForm.name;
      target.dosage = seasoningDialogForm.dosage;
    }
  } else {
    seasonings.value.unshift({
      id: Date.now(),
      name: seasoningDialogForm.name,
      dosage: seasoningDialogForm.dosage
    });
  }

  seasoningDialogVisible.value = false;
  resetSeasoningDialogForm();
  ElMessage.success("调料已保存");
}

async function saveIngredient() {
  const valid = await ingredientDialogRef.value?.validate().catch(() => false);
  if (!valid) return;

  if (ingredientDialogForm.id) {
    const target = ingredients.value.find(item => item.id === ingredientDialogForm.id);
    if (target) {
      target.name = ingredientDialogForm.name;
      target.dosage = ingredientDialogForm.dosage;
      target.preparation = ingredientDialogForm.preparation;
    }
  } else {
    ingredients.value.unshift({
      id: Date.now(),
      name: ingredientDialogForm.name,
      dosage: ingredientDialogForm.dosage,
      preparation: ingredientDialogForm.preparation
    });
  }

  ingredientDialogVisible.value = false;
  resetIngredientDialogForm();
  ElMessage.success("食材已保存");
}

async function saveRecipeStep() {
  const valid = await recipeStepDialogRef.value?.validate().catch(() => false);
  if (!valid) return;

  if (recipeStepDialogForm.id) {
    const target = recipeSteps.value.find(item => item.id === recipeStepDialogForm.id);
    if (target) {
      target.order = Number(recipeStepDialogForm.order);
      target.description = recipeStepDialogForm.description;
      target.sampleImage = recipeStepDialogForm.sampleImage;
    }
  } else {
    recipeSteps.value.unshift({
      id: Date.now(),
      order: Number(recipeStepDialogForm.order),
      description: recipeStepDialogForm.description,
      sampleImage: recipeStepDialogForm.sampleImage
    });
  }

  recipeSteps.value.sort((a, b) => a.order - b.order);
  recipeStepDialogVisible.value = false;
  resetRecipeStepDialogForm();
  ElMessage.success("制作步骤已保存");
}

function deleteSeasoning(id: number) {
  seasonings.value = seasonings.value.filter(item => item.id !== id);
  resetPageWhenNeeded(filteredSeasonings.value, seasoningState);
  ElMessage.success("调料已删除");
}

function deleteIngredient(id: number) {
  ingredients.value = ingredients.value.filter(item => item.id !== id);
  resetPageWhenNeeded(filteredIngredients.value, ingredientState);
  ElMessage.success("食材已删除");
}

function deleteRecipeStep(id: number) {
  recipeSteps.value = recipeSteps.value.filter(item => item.id !== id);
  resetPageWhenNeeded(filteredRecipeSteps.value, recipeStepState);
  ElMessage.success("制作步骤已删除");
}

function handleSearchSection(state: PagedSectionState) {
  state.pageNum = 1;
}

function goPrevious() {
  if (activeStep.value === 0) {
    router.push("/dish/list");
    return;
  }
  activeStep.value -= 1;
}

async function submitRecipe() {
  const payload: CreateRecipePayload = {
    name: dishInfoForm.name,
    durationMinutes: Number(dishInfoForm.durationMinutes),
    tips: dishInfoForm.tips,
    cover: dishInfoForm.cover,
    seasonings: seasonings.value.map(item => ({
      name: item.name,
      dosage: item.dosage
    })),
    ingredients: ingredients.value.map(item => ({
      name: item.name,
      dosage: item.dosage,
      preparation: item.preparation
    })),
    steps: recipeSteps.value.map(item => ({
      order: item.order,
      description: item.description,
      sampleImage: item.sampleImage
    }))
  };

  submitting.value = true;
  try {
    await createRecipe(payload);
    activeStep.value = 4;
    ElMessage.success("菜谱创建成功");
  } finally {
    submitting.value = false;
  }
}

async function goNext() {
  if (activeStep.value === 0) {
    const valid = await dishInfoFormRef.value?.validate().catch(() => false);
    if (!valid) return;
  }

  if (activeStep.value === 3) {
    await submitRecipe();
    return;
  }

  if (activeStep.value < 4) {
    activeStep.value += 1;
    return;
  }

  router.push("/dish/list");
}
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step v-for="title in stepTitles" :key="title" :title="title" />
      </el-steps>
    </el-card>

    <el-card shadow="never" class="min-h-[520px]">
      <el-form
        v-if="activeStep === 0"
        ref="dishInfoFormRef"
        :model="dishInfoForm"
        :rules="dishInfoRules"
        label-position="top"
        class="mx-auto max-w-[760px] pt-8"
      >
        <el-form-item label="菜品名称" prop="name" required>
          <el-input v-model="dishInfoForm.name" placeholder="请输入菜品名称" />
        </el-form-item>
        <el-form-item label="预计用时" prop="durationMinutes" required>
          <el-input
            v-model="dishInfoForm.durationMinutes"
            placeholder="请输入预计用时（分钟）"
          />
        </el-form-item>
        <el-form-item label="小贴士" prop="tips">
          <el-input
            v-model="dishInfoForm.tips"
            type="textarea"
            :rows="4"
            placeholder="请输入小贴士"
          />
        </el-form-item>
        <el-form-item label="菜品图片" prop="cover">
          <el-upload
            class="w-full"
            drag
            accept="image/*"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onCoverChange"
          >
            <div class="space-y-2">
              <IconifyIconOnline icon="ep:upload-filled" class="text-[24px] text-primary" />
              <div class="text-sm text-text_color_regular">点击或拖拽上传菜品图片</div>
            </div>
          </el-upload>
          <div v-if="dishInfoForm.cover" class="mt-4">
            <img
              :src="dishInfoForm.cover"
              alt="菜品图片预览"
              class="h-40 w-40 rounded-lg object-cover border border-solid border-[#dcdfe6]"
            />
          </div>
        </el-form-item>
      </el-form>

      <template v-else-if="activeStep === 1">
        <div class="mb-4 flex items-center justify-between gap-4">
          <el-input
            v-model="seasoningState.keyword"
            placeholder="搜索调料名"
            clearable
            class="w-[260px]"
            @input="handleSearchSection(seasoningState)"
          />
          <el-button type="primary" @click="openSeasoningDialog()">添加调料</el-button>
        </div>
        <el-table :data="pagedSeasonings" border>
          <el-table-column label="调料名" prop="name" min-width="220" />
          <el-table-column label="用量" prop="dosage" min-width="180" />
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="openSeasoningDialog(row)">编辑</el-button>
              <el-button link type="danger" @click="deleteSeasoning(row.id)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无调料数据" />
          </template>
        </el-table>
        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:current-page="seasoningState.pageNum"
            :page-size="seasoningState.pageSize"
            :total="filteredSeasonings.length"
            layout="total, prev, pager, next, jumper"
            background
          />
        </div>
      </template>

      <template v-else-if="activeStep === 2">
        <div class="mb-4 flex items-center justify-between gap-4">
          <el-input
            v-model="ingredientState.keyword"
            placeholder="搜索食材名"
            clearable
            class="w-[260px]"
            @input="handleSearchSection(ingredientState)"
          />
          <el-button type="primary" @click="openIngredientDialog()">添加食材</el-button>
        </div>
        <el-table :data="pagedIngredients" border>
          <el-table-column label="食材名" prop="name" min-width="180" />
          <el-table-column label="用量" prop="dosage" min-width="160" />
          <el-table-column
            label="处理方式"
            prop="preparation"
            min-width="260"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="openIngredientDialog(row)">编辑</el-button>
              <el-button link type="danger" @click="deleteIngredient(row.id)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无食材数据" />
          </template>
        </el-table>
        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:current-page="ingredientState.pageNum"
            :page-size="ingredientState.pageSize"
            :total="filteredIngredients.length"
            layout="total, prev, pager, next, jumper"
            background
          />
        </div>
      </template>

      <template v-else-if="activeStep === 3">
        <div class="mb-4 flex items-center justify-between gap-4">
          <el-input
            v-model="recipeStepState.keyword"
            placeholder="搜索步骤序号或描述"
            clearable
            class="w-[260px]"
            @input="handleSearchSection(recipeStepState)"
          />
          <el-button type="primary" @click="openRecipeStepDialog()">添加制作步骤</el-button>
        </div>
        <el-table :data="pagedRecipeSteps" border>
          <el-table-column label="第几步" prop="order" width="120" align="center" />
          <el-table-column
            label="描述"
            prop="description"
            min-width="360"
            show-overflow-tooltip
          />
          <el-table-column
            label="示例图片"
            prop="sampleImage"
            min-width="260"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="openRecipeStepDialog(row)">编辑</el-button>
              <el-button link type="danger" @click="deleteRecipeStep(row.id)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无制作步骤" />
          </template>
        </el-table>
        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:current-page="recipeStepState.pageNum"
            :page-size="recipeStepState.pageSize"
            :total="filteredRecipeSteps.length"
            layout="total, prev, pager, next, jumper"
            background
          />
        </div>
      </template>

      <div v-else class="flex min-h-[420px] flex-col items-center justify-center gap-6">
        <div class="flex h-28 w-28 items-center justify-center rounded-full bg-[#67c23a] text-white">
          <IconifyIconOnline icon="ep:select" class="text-[52px]" />
        </div>
        <div class="text-4xl font-semibold text-text_color_primary">提交成功</div>
      </div>
    </el-card>

    <div class="flex items-center justify-between">
      <el-button @click="goPrevious">
        {{ activeStep === 0 ? "返回" : "上一步" }}
      </el-button>
      <el-button type="primary" :loading="submitting" @click="goNext">
        {{ activeStep === 4 ? "完成" : activeStep === 3 ? "提交" : "下一步" }}
      </el-button>
    </div>

    <el-dialog v-model="seasoningDialogVisible" :title="seasoningDialogTitle" width="520px">
      <el-form
        ref="seasoningDialogRef"
        :model="seasoningDialogForm"
        :rules="seasoningDialogRules"
        label-position="top"
      >
        <el-form-item label="调料名" prop="name">
          <el-input v-model="seasoningDialogForm.name" placeholder="请输入调料名" />
        </el-form-item>
        <el-form-item label="用量" prop="dosage">
          <el-input v-model="seasoningDialogForm.dosage" placeholder="请输入用量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="seasoningDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSeasoning">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="ingredientDialogVisible" :title="ingredientDialogTitle" width="560px">
      <el-form
        ref="ingredientDialogRef"
        :model="ingredientDialogForm"
        :rules="ingredientDialogRules"
        label-position="top"
      >
        <el-form-item label="食材名" prop="name">
          <el-input v-model="ingredientDialogForm.name" placeholder="请输入食材名" />
        </el-form-item>
        <el-form-item label="用量" prop="dosage">
          <el-input v-model="ingredientDialogForm.dosage" placeholder="请输入用量" />
        </el-form-item>
        <el-form-item label="处理方式" prop="preparation">
          <el-input
            v-model="ingredientDialogForm.preparation"
            type="textarea"
            :rows="4"
            placeholder="请输入处理方式"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ingredientDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveIngredient">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="recipeStepDialogVisible" :title="recipeStepDialogTitle" width="620px">
      <el-form
        ref="recipeStepDialogRef"
        :model="recipeStepDialogForm"
        :rules="recipeStepDialogRules"
        label-position="top"
      >
        <el-form-item label="步骤序号" prop="order">
          <el-input-number
            v-model="recipeStepDialogForm.order"
            :min="1"
            controls-position="right"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="recipeStepDialogForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入步骤描述"
          />
        </el-form-item>
        <el-form-item label="示例图片" prop="sampleImage">
          <el-input
            v-model="recipeStepDialogForm.sampleImage"
            type="textarea"
            :rows="3"
            placeholder="请输入示例图片地址或说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="recipeStepDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRecipeStep">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
