<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadFile,
  type UploadProps
} from "element-plus";
import {
  createRecipe,
  getRecipeDetail,
  type CreateRecipePayload,
  type RecipeIngredientItem,
  type RecipeSeasoningItem,
  type RecipeStepItem,
  type RecipeDetail
} from "@/api/recipe";
import { getUploadedFileUrl, uploadFile } from "@/api/file";

defineOptions({
  name: "DishSave"
});

interface DishInfoForm {
  id: number;
  name: string;
  takeTimes: string;
  checkStatus: 1 | 2;
  tips: string;
  imgPath: string;
}

interface SeasoningDialogForm {
  id: number | null;
  editingIndex: number | null;
  flavorName: string;
  dosage: string;
}

interface IngredientDialogForm {
  id: number | null;
  editingIndex: number | null;
  materialName: string;
  dosage: string;
  deal: string;
}

interface StepDialogForm {
  id: number | null;
  editingIndex: number | null;
  sort: number | null;
  stepDescribe: string;
  stepImage: string;
}

interface PagedSectionState {
  keyword: string;
  pageNum: number;
  pageSize: number;
}
const route = useRoute();
const router = useRouter();
const dishId = computed(() => Number(route.params.id));
const activeStep = ref(0);
const submitting = ref(false);
const coverUploading = ref(false);
const coverPreviewUrl = ref("");
const stepImageUploading = ref(false);
const stepImagePreviewUrl = ref("");
const stepPreviewVisible = ref(false);
const stepPreviewImage = ref("");
const dishInfoFormRef = ref<FormInstance>();

const stepTitles = ["菜品信息", "调料信息", "食材信息", "制作步骤", "完成"];
const fixedPageSize = 5;

const dishInfoForm = reactive<DishInfoForm>({
  id: null,
  name: "菜名",
  takeTimes: "15",
  checkStatus: 1,
  tips: "这是一个测试菜谱",
  imgPath: ""
});

const dishInfoRules: FormRules<DishInfoForm> = {
  name: [{ required: true, message: "请输入菜品名称", trigger: "blur" }],
  takeTimes: [{ required: true, message: "请输入预计用时", trigger: "blur" }]
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

const seasonings = ref<RecipeSeasoningItem[]>([
  {
    id: null,
    flavorName: "盐",
    dosage: "5g"
  },
  {
    id: null,
    flavorName: "食用油",
    dosage: "5ml"
  }
]);
const ingredients = ref<RecipeIngredientItem[]>([
  {
    id: null,
    materialName: "食材1",
    dosage: "1个",
    deal: "食材1处理方式"
  }
]);
const recipeSteps = ref<RecipeStepItem[]>([
  {
    id: null,
    sort: 1,
    stepDescribe: "这是测试菜谱的制作步骤1",
    stepImage: "图片相对地址"
  },
  {
    id: null,
    sort: 2,
    stepDescribe: "这是测试菜谱的制作步骤2",
    stepImage: "图片相对地址"
  }
]);

const seasoningDialogVisible = ref(false);
const ingredientDialogVisible = ref(false);
const recipeStepDialogVisible = ref(false);

const seasoningDialogForm = reactive<SeasoningDialogForm>({
  id: null,
  editingIndex: null,
  flavorName: "",
  dosage: ""
});
const ingredientDialogForm = reactive<IngredientDialogForm>({
  id: null,
  editingIndex: null,
  materialName: "",
  dosage: "",
  deal: ""
});
const recipeStepDialogForm = reactive<StepDialogForm>({
  id: null,
  editingIndex: null,
  sort: null,
  stepDescribe: "",
  stepImage: ""
});

const seasoningDialogRef = ref<FormInstance>();
const ingredientDialogRef = ref<FormInstance>();
const recipeStepDialogRef = ref<FormInstance>();

const seasoningDialogRules: FormRules<SeasoningDialogForm> = {
  flavorName: [{ required: true, message: "请输入调料名", trigger: "blur" }],
  dosage: [{ required: true, message: "请输入用量", trigger: "blur" }]
};

const ingredientDialogRules: FormRules<IngredientDialogForm> = {
  materialName: [{ required: true, message: "请输入食材名", trigger: "blur" }],
  dosage: [{ required: true, message: "请输入用量", trigger: "blur" }],
  deal: [{ required: true, message: "请输入处理方式", trigger: "blur" }]
};

const recipeStepDialogRules: FormRules<StepDialogForm> = {
  sort: [
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
  stepDescribe: [{ required: true, message: "请输入描述", trigger: "blur" }],
  stepImage: [{ required: true, message: "请输入示例图片", trigger: "blur" }]
};

const filteredSeasonings = computed(() => {
  const keyword = seasoningState.keyword.trim();
  return keyword
    ? seasonings.value.filter(item => item.flavorName.includes(keyword))
    : seasonings.value;
});
const filteredIngredients = computed(() => {
  const keyword = ingredientState.keyword.trim();
  return keyword
    ? ingredients.value.filter(item => item.materialName.includes(keyword))
    : ingredients.value;
});
const filteredRecipeSteps = computed(() => {
  const keyword = recipeStepState.keyword.trim();
  return keyword
    ? recipeSteps.value.filter(
        item =>
          item.stepDescribe.includes(keyword) ||
          String(item.sort).includes(keyword)
      )
    : recipeSteps.value;
});

const pagedSeasonings = computed(() => {
  const start = (seasoningState.pageNum - 1) * seasoningState.pageSize;
  return filteredSeasonings.value.slice(start, start + seasoningState.pageSize);
});
const pagedIngredients = computed(() => {
  const start = (ingredientState.pageNum - 1) * ingredientState.pageSize;
  return filteredIngredients.value.slice(
    start,
    start + ingredientState.pageSize
  );
});
const pagedRecipeSteps = computed(() => {
  const start = (recipeStepState.pageNum - 1) * recipeStepState.pageSize;
  return filteredRecipeSteps.value.slice(
    start,
    start + recipeStepState.pageSize
  );
});

const seasoningDialogTitle = computed(() =>
  seasoningDialogForm.editingIndex !== null ? "编辑调料" : "添加调料"
);
const ingredientDialogTitle = computed(() =>
  ingredientDialogForm.editingIndex !== null ? "编辑食材" : "添加食材"
);
const recipeStepDialogTitle = computed(() =>
  recipeStepDialogForm.editingIndex !== null ? "编辑制作步骤" : "添加制作步骤"
);

const coverDisplayUrl = computed(
  () => coverPreviewUrl.value || getUploadedFileUrl(dishInfoForm.imgPath)
);
const stepImageDisplayUrl = computed(
  () =>
    stepImagePreviewUrl.value ||
    getUploadedFileUrl(recipeStepDialogForm.stepImage)
);

function revokeCoverPreviewUrl() {
  if (!coverPreviewUrl.value) return;
  URL.revokeObjectURL(coverPreviewUrl.value);
  coverPreviewUrl.value = "";
}

function revokeStepImagePreviewUrl() {
  if (!stepImagePreviewUrl.value) return;
  URL.revokeObjectURL(stepImagePreviewUrl.value);
  stepImagePreviewUrl.value = "";
}

const onCoverChange: UploadProps["onChange"] = async (fileItem: UploadFile) => {
  if (!fileItem.raw) return;
  revokeCoverPreviewUrl();
  coverPreviewUrl.value = URL.createObjectURL(fileItem.raw);
  coverUploading.value = true;

  try {
    const result = await uploadFile(fileItem.raw);
    dishInfoForm.imgPath = result.data;
    ElMessage.success(result.message || "图片上传成功");
  } catch (error) {
    revokeCoverPreviewUrl();
    dishInfoForm.imgPath = "";
    ElMessage.error("图片上传失败，请稍后重试");
  } finally {
    coverUploading.value = false;
  }
};

const onStepImageChange: UploadProps["onChange"] = async (fileItem: UploadFile) => {
  if (!fileItem.raw) return;
  revokeStepImagePreviewUrl();
  stepImagePreviewUrl.value = URL.createObjectURL(fileItem.raw);
  stepImageUploading.value = true;

  try {
    const result = await uploadFile(fileItem.raw);
    recipeStepDialogForm.stepImage = result.data;
    ElMessage.success(result.message || "图片上传成功");
    await recipeStepDialogRef.value?.validateField("stepImage");
  } catch (error) {
    revokeStepImagePreviewUrl();
    recipeStepDialogForm.stepImage = "";
    ElMessage.error("图片上传失败，请稍后重试");
  } finally {
    stepImageUploading.value = false;
  }
};

function resetSeasoningDialogForm() {
  seasoningDialogForm.id = null;
  seasoningDialogForm.editingIndex = null;
  seasoningDialogForm.flavorName = "";
  seasoningDialogForm.dosage = "";
}

function resetIngredientDialogForm() {
  ingredientDialogForm.id = null;
  ingredientDialogForm.editingIndex = null;
  ingredientDialogForm.materialName = "";
  ingredientDialogForm.dosage = "";
  ingredientDialogForm.deal = "";
}

function resetRecipeStepDialogForm() {
  revokeStepImagePreviewUrl();
  recipeStepDialogForm.id = null;
  recipeStepDialogForm.editingIndex = null;
  recipeStepDialogForm.sort = null;
  recipeStepDialogForm.stepDescribe = "";
  recipeStepDialogForm.stepImage = "";
}

function resetPageWhenNeeded<T>(list: T[], state: PagedSectionState) {
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  if (state.pageNum > totalPages) {
    state.pageNum = totalPages;
  }
}

function openSeasoningDialog(item?: RecipeSeasoningItem) {
  if (item) {
    const editingIndex = seasonings.value.indexOf(item);
    seasoningDialogForm.editingIndex = editingIndex > -1 ? editingIndex : null;
    seasoningDialogForm.id = item.id;
    seasoningDialogForm.flavorName = item.flavorName;
    seasoningDialogForm.dosage = item.dosage;
  } else {
    resetSeasoningDialogForm();
  }
  seasoningDialogVisible.value = true;
}

function openIngredientDialog(item?: RecipeIngredientItem) {
  if (item) {
    const editingIndex = ingredients.value.indexOf(item);
    ingredientDialogForm.editingIndex = editingIndex > -1 ? editingIndex : null;
    ingredientDialogForm.id = item.id;
    ingredientDialogForm.materialName = item.materialName;
    ingredientDialogForm.dosage = item.dosage;
    ingredientDialogForm.deal = item.deal;
  } else {
    resetIngredientDialogForm();
  }
  ingredientDialogVisible.value = true;
}

function openRecipeStepDialog(item?: RecipeStepItem) {
  revokeStepImagePreviewUrl();
  if (item) {
    const editingIndex = recipeSteps.value.indexOf(item);
    recipeStepDialogForm.editingIndex = editingIndex > -1 ? editingIndex : null;
    recipeStepDialogForm.id = item.id;
    recipeStepDialogForm.sort = item.sort;
    recipeStepDialogForm.stepDescribe = item.stepDescribe;
    recipeStepDialogForm.stepImage = item.stepImage;
  } else {
    resetRecipeStepDialogForm();
  }
  recipeStepDialogVisible.value = true;
}

function closeRecipeStepDialog() {
  recipeStepDialogVisible.value = false;
  stepImageUploading.value = false;
  resetRecipeStepDialogForm();
}

function getStepImageUrl(path?: string) {
  return getUploadedFileUrl(path);
}

function previewStepImage(path?: string) {
  const imageUrl = getStepImageUrl(path);
  if (!imageUrl) return;
  stepPreviewImage.value = imageUrl;
  stepPreviewVisible.value = true;
}

async function saveSeasoning() {
  const valid = await seasoningDialogRef.value?.validate().catch(() => false);
  if (!valid) return;

  if (seasoningDialogForm.editingIndex !== null) {
    const target = seasonings.value[seasoningDialogForm.editingIndex];
    if (target) {
      target.flavorName = seasoningDialogForm.flavorName;
      target.dosage = seasoningDialogForm.dosage;
    }
  } else {
    seasonings.value.unshift({
      id: null,
      flavorName: seasoningDialogForm.flavorName,
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

  if (ingredientDialogForm.editingIndex !== null) {
    const target = ingredients.value[ingredientDialogForm.editingIndex];
    if (target) {
      target.materialName = ingredientDialogForm.materialName;
      target.dosage = ingredientDialogForm.dosage;
      target.deal = ingredientDialogForm.deal;
    }
  } else {
    ingredients.value.unshift({
      id: null,
      materialName: ingredientDialogForm.materialName,
      dosage: ingredientDialogForm.dosage,
      deal: ingredientDialogForm.deal
    });
  }

  ingredientDialogVisible.value = false;
  resetIngredientDialogForm();
  ElMessage.success("食材已保存");
}

async function saveRecipeStep() {
  const valid = await recipeStepDialogRef.value?.validate().catch(() => false);
  if (!valid) return;

  if (recipeStepDialogForm.editingIndex !== null) {
    const target = recipeSteps.value[recipeStepDialogForm.editingIndex];
    if (target) {
      target.sort = Number(recipeStepDialogForm.sort);
      target.stepDescribe = recipeStepDialogForm.stepDescribe;
      target.stepImage = recipeStepDialogForm.stepImage;
    }
  } else {
    recipeSteps.value.unshift({
      id: null,
      sort: Number(recipeStepDialogForm.sort),
      stepDescribe: recipeStepDialogForm.stepDescribe,
      stepImage: recipeStepDialogForm.stepImage
    });
  }

  recipeSteps.value.sort((a, b) => a.sort - b.sort);
  recipeStepDialogVisible.value = false;
  resetRecipeStepDialogForm();
  ElMessage.success("制作步骤已保存");
}

function deleteSeasoning(item: RecipeSeasoningItem) {
  const targetIndex = seasonings.value.indexOf(item);
  if (targetIndex === -1) return;
  seasonings.value.splice(targetIndex, 1);
  resetPageWhenNeeded(filteredSeasonings.value, seasoningState);
  ElMessage.success("调料已删除");
}

function deleteIngredient(item: RecipeIngredientItem) {
  const targetIndex = ingredients.value.indexOf(item);
  if (targetIndex === -1) return;
  ingredients.value.splice(targetIndex, 1);
  resetPageWhenNeeded(filteredIngredients.value, ingredientState);
  ElMessage.success("食材已删除");
}

function deleteRecipeStep(item: RecipeStepItem) {
  const targetIndex = recipeSteps.value.indexOf(item);
  if (targetIndex === -1) return;
  recipeSteps.value.splice(targetIndex, 1);
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
    id: dishInfoForm.id,
    name: dishInfoForm.name,
    takeTimes: dishInfoForm.takeTimes,
    checkStatus: dishInfoForm.checkStatus,
    tips: dishInfoForm.tips,
    imgPath: dishInfoForm.imgPath,
    flavors: seasonings.value.map(item => ({
      id: item.id,
      flavorName: item.flavorName,
      dosage: item.dosage
    })),
    materials: ingredients.value.map(item => ({
      id: item.id,
      materialName: item.materialName,
      dosage: item.dosage,
      deal: item.deal
    })),
    steps: recipeSteps.value.map(item => ({
      id: item.id,
      sort: item.sort,
      stepDescribe: item.stepDescribe,
      stepImage: item.stepImage
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

async function loadRecipeDetail() {
  try {
    if (dishId.value) {
      const result = await getRecipeDetail(dishId.value);
      revokeCoverPreviewUrl();
      dishInfoForm.id = result.data.id;
      dishInfoForm.name = result.data.name;
      dishInfoForm.takeTimes = result.data.takeTimes;
      dishInfoForm.checkStatus = result.data.checkStatus;
      dishInfoForm.tips = result.data.tips;
      dishInfoForm.imgPath = result.data.imgPath;
      seasonings.value = result.data.flavorList;
      ingredients.value = result.data.materialList;
      recipeSteps.value = result.data.stepList;
    }
  } finally {
  }
}

onMounted(() => {
  loadRecipeDetail();
});

onBeforeUnmount(() => {
  revokeCoverPreviewUrl();
  revokeStepImagePreviewUrl();
});
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <el-steps :active="activeStep + 1" finish-status="success" align-center>
        <el-step v-for="title in stepTitles" :key="title" :title="title" />
      </el-steps>
    </el-card>

    <el-card shadow="never" class="min-h-[520px]">
      <el-form
        v-if="activeStep === 0"
        ref="dishInfoFormRef"
        :rules="dishInfoRules"
        :model="dishInfoForm"
        label-position="top"
        class="mx-auto max-w-[760px] pt-8"
      >
        <el-form-item label="菜品名称" prop="name" required>
          <el-input v-model="dishInfoForm.name" placeholder="请输入菜品名称" />
        </el-form-item>
        <el-form-item label="预计用时" prop="takeTimes" required>
          <el-input
            v-model="dishInfoForm.takeTimes"
            placeholder="请输入预计用时（分钟）"
          />
        </el-form-item>
        <el-form-item label="校验状态" prop="checkStatus" required>
          <el-select
            v-model="dishInfoForm.checkStatus"
            placeholder="请选择校验状态"
            class="w-full"
          >
            <el-option :value="1" label="未经人工校验" />
            <el-option :value="2" label="经过人工校验" />
          </el-select>
        </el-form-item>
        <el-form-item label="小贴士" prop="tips">
          <el-input
            v-model="dishInfoForm.tips"
            type="textarea"
            :rows="4"
            placeholder="请输入小贴士"
          />
        </el-form-item>
        <el-form-item label="菜品图片" prop="imgPath">
          <el-upload
            class="w-full"
            drag
            accept="image/*"
            :auto-upload="false"
            :show-file-list="false"
            :disabled="coverUploading"
            :on-change="onCoverChange"
          >
            <img
              v-if="coverDisplayUrl"
              :src="coverDisplayUrl"
              alt="菜品图片预览"
              class="h-40 w-40 rounded-lg object-cover bsort bsort-solid bsort-[#dcdfe6]"
            />
            <div class="space-y-2">
              <div class="text-sm text-text_color_regular">
                {{
                  coverUploading ? "图片上传中..." : "点击上传菜品图片"
                }}
              </div>
            </div>
          </el-upload>
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
          <el-button type="primary" @click="openSeasoningDialog()"
            >添加调料</el-button
          >
        </div>
        <el-table :data="pagedSeasonings" bsort>
          <el-table-column label="调料名" prop="flavorName" min-width="220" />
          <el-table-column label="用量" prop="dosage" min-width="180" />
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="openSeasoningDialog(row)"
                >编辑</el-button
              >
              <el-button link type="danger" @click="deleteSeasoning(row)"
                >删除</el-button
              >
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
          <el-button type="primary" @click="openIngredientDialog()"
            >添加食材</el-button
          >
        </div>
        <el-table :data="pagedIngredients" bsort>
          <el-table-column label="食材名" prop="materialName" min-width="180" />
          <el-table-column label="用量" prop="dosage" min-width="160" />
          <el-table-column
            label="处理方式"
            prop="deal"
            min-width="260"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="openIngredientDialog(row)"
                >编辑</el-button
              >
              <el-button link type="danger" @click="deleteIngredient(row)"
                >删除</el-button
              >
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
          <el-button type="primary" @click="openRecipeStepDialog()"
            >添加制作步骤</el-button
          >
        </div>
        <el-table :data="pagedRecipeSteps" bsort>
          <el-table-column
            label="第几步"
            prop="sort"
            width="120"
            align="center"
          />
          <el-table-column
            label="描述"
            prop="stepDescribe"
            min-width="360"
            show-overflow-tooltip
          />
          <el-table-column
            label="示例图片"
            min-width="260"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="!row.stepImage" class="text-text_color_placeholder">
                暂未上传
              </span>
              <el-image
                v-else
                :src="getStepImageUrl(row.stepImage)"
                fit="cover"
                class="h-[72px] w-[108px] cursor-pointer rounded-md"
                :preview-src-list="[]"
                @click="previewStepImage(row.stepImage)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="openRecipeStepDialog(row)"
                >编辑</el-button
              >
              <el-button link type="danger" @click="deleteRecipeStep(row)"
                >删除</el-button
              >
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

      <div
        v-else
        class="flex min-h-[420px] flex-col items-center justify-center gap-6"
      >
        <div
          class="flex h-28 w-28 items-center justify-center rounded-full bg-[#67c23a] text-white"
        >
          <IconifyIconOnline icon="ep:select" class="text-[52px]" />
        </div>
        <div class="text-4xl font-semibold text-text_color_primary">
          提交成功
        </div>
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

    <el-dialog
      v-model="seasoningDialogVisible"
      :title="seasoningDialogTitle"
      width="520px"
    >
      <el-form
        ref="seasoningDialogRef"
        :model="seasoningDialogForm"
        :rules="seasoningDialogRules"
        label-position="top"
      >
        <el-form-item label="调料名" prop="flavorName">
          <el-input
            v-model="seasoningDialogForm.flavorName"
            placeholder="请输入调料名"
          />
        </el-form-item>
        <el-form-item label="用量" prop="dosage">
          <el-input
            v-model="seasoningDialogForm.dosage"
            placeholder="请输入用量"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="seasoningDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSeasoning">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="ingredientDialogVisible"
      :title="ingredientDialogTitle"
      width="560px"
    >
      <el-form
        ref="ingredientDialogRef"
        :model="ingredientDialogForm"
        :rules="ingredientDialogRules"
        label-position="top"
      >
        <el-form-item label="食材名" prop="materialName">
          <el-input
            v-model="ingredientDialogForm.materialName"
            placeholder="请输入食材名"
          />
        </el-form-item>
        <el-form-item label="用量" prop="dosage">
          <el-input
            v-model="ingredientDialogForm.dosage"
            placeholder="请输入用量"
          />
        </el-form-item>
        <el-form-item label="处理方式" prop="deal">
          <el-input
            v-model="ingredientDialogForm.deal"
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

    <el-dialog
      v-model="recipeStepDialogVisible"
      :title="recipeStepDialogTitle"
      width="620px"
    >
      <el-form
        ref="recipeStepDialogRef"
        :model="recipeStepDialogForm"
        :rules="recipeStepDialogRules"
        label-position="top"
      >
        <el-form-item label="描述" prop="stepDescribe">
          <el-input
            v-model="recipeStepDialogForm.stepDescribe"
            type="textarea"
            :rows="4"
            placeholder="请输入步骤描述"
          />
        </el-form-item>
        <el-form-item label="步骤序号" prop="sort">
          <el-input-number
            v-model="recipeStepDialogForm.sort"
            :min="1"
            controls-position="right"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="示例图片" prop="stepImage">
          <el-upload
            class="w-full"
            drag
            accept="image/*"
            :auto-upload="false"
            :show-file-list="false"
            :disabled="stepImageUploading"
            :on-change="onStepImageChange"
          >
            <img
              v-if="stepImageDisplayUrl"
              :src="stepImageDisplayUrl"
              alt="步骤示例图片预览"
              class="h-40 w-40 rounded-lg object-cover bsort bsort-solid bsort-[#dcdfe6]"
            />
            <div class="space-y-2">

              <div class="text-sm text-text_color_regular">
                {{ stepImageUploading ? "图片上传中..." : "点击上传步骤示例图" }}
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeRecipeStepDialog">取消</el-button>
        <el-button type="primary" @click="saveRecipeStep">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="stepPreviewVisible" width="720px" title="示例图片预览">
      <img :src="stepPreviewImage" alt="示例图片预览" class="w-full rounded-lg" />
    </el-dialog>
  </div>
</template>
