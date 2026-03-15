<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getRecipeDetail, type RecipeDetail } from "@/api/recipe";

defineOptions({
  name: "DishDetail"
});

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const recipe = ref<RecipeDetail | null>(null);
const previewVisible = ref(false);
const previewImage = ref("");

const recipeId = computed(() => Number(route.params.id));

async function loadRecipeDetail() {
  loading.value = true;
  try {
    const result = await getRecipeDetail(recipeId.value);
    recipe.value = result.data;
  } finally {
    loading.value = false;
  }
}

function handlePreview(image: string) {
  previewImage.value = image;
  previewVisible.value = true;
}

onMounted(() => {
  loadRecipeDetail();
});
</script>

<template>
  <div class="space-y-4">
    <el-page-header content="菜谱详情" @back="router.push('/dish/list')" />

    <el-card v-loading="loading" shadow="never">
      <el-descriptions v-if="recipe" :column="2" border>
        <el-descriptions-item label="菜谱名称">
          {{ recipe.name }}
        </el-descriptions-item>
        <el-descriptions-item label="创建日期">
          {{ recipe.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="食材数量">
          {{ recipe.ingredientCount }}
        </el-descriptions-item>
        <el-descriptions-item label="调料数量">
          {{ recipe.seasoningCount }}
        </el-descriptions-item>
        <el-descriptions-item label="步骤数量">
          {{ recipe.stepCount }}
        </el-descriptions-item>
        <el-descriptions-item label="预计用时">
          {{ recipe.durationMinutes }} 分钟
        </el-descriptions-item>
        <el-descriptions-item label="浏览量">
          {{ recipe.viewCount }}
        </el-descriptions-item>
        <el-descriptions-item label="活跃值">
          {{ recipe.activityValue }}
        </el-descriptions-item>
        <el-descriptions-item label="人气值">
          {{ recipe.popularityValue }}
        </el-descriptions-item>
        <el-descriptions-item label="校验状态">
          <el-tag :type="recipe.verifyStatus === 2 ? 'success' : 'warning'">
            {{ recipe.verifyStatus === 2 ? "已校验" : "未校验" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="标签" :span="2">
          <div class="flex flex-wrap gap-2">
            <el-tag v-for="tag in recipe.tags" :key="tag" effect="plain">
              {{ tag }}
            </el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="recipe" shadow="never">
      <template #header>
        <div class="text-base font-semibold">调料信息</div>
      </template>
      <el-table :data="recipe.seasonings" border>
        <el-table-column label="调料名" prop="name" min-width="220" />
        <el-table-column label="用量" prop="dosage" min-width="180" />
      </el-table>
    </el-card>

    <el-card v-if="recipe" shadow="never">
      <template #header>
        <div class="text-base font-semibold">食材信息</div>
      </template>
      <el-table :data="recipe.ingredients" border>
        <el-table-column label="食材名" prop="name" min-width="180" />
        <el-table-column label="用量" prop="dosage" min-width="160" />
        <el-table-column
          label="处理方式"
          prop="preparation"
          min-width="320"
          show-overflow-tooltip
        />
      </el-table>
    </el-card>

    <el-card v-if="recipe" shadow="never">
      <template #header>
        <div class="text-base font-semibold">制作步骤</div>
      </template>
      <el-table :data="recipe.steps" border>
        <el-table-column
          label="第几步"
          prop="order"
          width="100"
          align="center"
        />
        <el-table-column
          label="描述"
          prop="description"
          min-width="420"
          show-overflow-tooltip
        />
        <el-table-column label="示例图" min-width="180" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.sampleImage"
              fit="cover"
              class="h-[72px] w-[108px] rounded-md cursor-pointer"
              :preview-src-list="[]"
              @click="handlePreview(row.sampleImage)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="previewVisible" width="720px" title="示例图预览">
      <img :src="previewImage" alt="示例图预览" class="w-full rounded-lg" />
    </el-dialog>
  </div>
</template>
