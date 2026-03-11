<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getRecipeDetail, type RecipeItem } from "@/api/recipe";

defineOptions({
  name: "DishDetail"
});

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const recipe = ref<RecipeItem | null>(null);

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
          <el-tag :type="recipe.verifyStatus === 'verified' ? 'success' : 'warning'">
            {{ recipe.verifyStatus === "verified" ? "已校验" : "未校验" }}
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
  </div>
</template>
