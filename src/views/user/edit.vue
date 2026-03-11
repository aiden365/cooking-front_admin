<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "UserEdit"
});

const route = useRoute();
const router = useRouter();

const userId = computed(() => route.params.id);
</script>

<template>
  <div class="space-y-4">
    <el-page-header content="编辑用户" @back="router.push('/user/list')" />

    <el-card shadow="never">
      <el-empty :description="`用户 ${userId} 的编辑页面将在下一步实现`">
        <el-button type="primary" @click="router.push('/user/list')">
          返回用户列表
        </el-button>
      </el-empty>
    </el-card>
  </div>
</template>
