<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "DishEdit"
});

const route = useRoute();
const router = useRouter();

const recipeId = computed(() => route.params.id);
</script>

<template>
  <div class="space-y-4">
    <el-page-header content="编辑菜谱" @back="router.push('/dish/list')" />

    <el-card shadow="never">
      <el-empty :description="`菜谱 ${recipeId} 的编辑页面将在下一步实现`">
        <el-button type="primary" @click="router.push('/dish/list')">
          返回菜谱列表
        </el-button>
      </el-empty>
    </el-card>
  </div>
</template>
