<script setup lang="ts">
import { useRouter } from "vue-router";

defineOptions({
  name: "DishAdd"
});

const router = useRouter();
</script>

<template>
  <div class="space-y-4">
    <el-page-header content="新增菜谱" @back="router.push('/dish/list')" />

    <el-card shadow="never">
      <el-empty description="菜谱新增页面将在下一步实现">
        <el-button type="primary" @click="router.push('/dish/list')">
          返回菜谱列表
        </el-button>
      </el-empty>
    </el-card>
  </div>
</template>
