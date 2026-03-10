<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Fighting"
});

import BIcon from "~icons/fa-solid/bold";
import Lock from "~icons/ri/lock-fill";
import AntDesignAndroidFilled from "~icons/ant-design/android-filled";

import Check from "~icons/ep/check";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
</script>

<template>
  <div>
    <component :is="useRenderIcon(Check)" />
    <!-- 传在线图标 -->
    <el-input :prefix-icon="useRenderIcon('ep:camera-filled')" />
    <BIcon style="font-size: 2em; color: red" />
    <AntDesignAndroidFilled style="font-size: 2em; color: red" />
    <IconifyIconOnline icon="ep:dish" width="60px" height="60px" />
  </div>
  <h1>加油</h1>
</template>
