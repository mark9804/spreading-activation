<script setup lang="ts">
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const store = useSpreadingActivationStore();
const route = useRoute();

// 处理页面关闭事件
function handleBeforeUnload(e: BeforeUnloadEvent) {
  // 只有在实验页面且实验未完成时才显示确认对话框
  // const isExperimentRoute = route.path.includes("/experiment");
  // const isExperimentInProgress =
  //   isExperimentRoute && !store.isExperimentComplete;
  // if (isExperimentInProgress) {
  //   e.preventDefault();
  //   // 设置确认消息
  //   const confirmationMessage = "実験は完了していません。ページを閉じると実験が中断されます。\nよろしいですか？";
  //   e.returnValue = confirmationMessage; // 标准做法，兼容大多数浏览器
  //   return confirmationMessage; // 为了兼容旧版浏览器
  // }
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <router-view />
</template>

<style scoped lang="scss"></style>
