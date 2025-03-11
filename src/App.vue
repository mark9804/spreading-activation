<script setup lang="ts">
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import { onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { eventBus } from "@/eventBus";
import { ref } from "vue";

const store = useSpreadingActivationStore();
const route = useRoute();

// 处理页面关闭事件
function handleBeforeUnload(e: BeforeUnloadEvent) {
  // 只有在实验页面且实验未完成时才显示确认对话框
  const isExperimentRoute = route.path.includes("/experiment");
  const isExperimentInProgress =
    isExperimentRoute && !store.isExperimentComplete;
  if (isExperimentInProgress) {
    e.preventDefault();
    // 设置确认消息
    const confirmationMessage =
      "実験は完了していません。ページを閉じると実験が中断されます。\nよろしいですか？";
    e.returnValue = confirmationMessage; // 标准做法，兼容大多数浏览器
    return confirmationMessage; // 为了兼容旧版浏览器
  }
}

// 按 「上上下下左右左右BA」 进入 debug 模式
const debugSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
const keySequence = ref<string[]>([]);
const sequenceTimeout = ref<number | null>(null);

const isDebugMode = computed(() => {
  return import.meta.env.DEV;
});

function handleDebugMode(event: KeyboardEvent) {
  // 清除之前的超时
  if (sequenceTimeout.value) {
    window.clearTimeout(sequenceTimeout.value);
  }

  // 添加当前按键到序列
  keySequence.value.push(event.key);

  // 只保留最后 10 个按键
  if (keySequence.value.length > debugSequence.length) {
    keySequence.value = keySequence.value.slice(-debugSequence.length);
  }

  // 检查序列是否匹配
  const isMatch =
    keySequence.value.length === debugSequence.length &&
    keySequence.value.every(
      (key, index) => key.toLowerCase() === debugSequence[index].toLowerCase()
    );

  if (isMatch) {
    console.log("Debug mode activated!");
    eventBus.emit("enterDebugMode");
    keySequence.value = []; // 重置序列
  }

  // 设置超时，如果 2 秒内没有新按键，则重置序列
  sequenceTimeout.value = window.setTimeout(() => {
    keySequence.value = [];
  }, 2000);
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("keydown", handleDebugMode);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.removeEventListener("keydown", handleDebugMode);
  if (sequenceTimeout.value) {
    window.clearTimeout(sequenceTimeout.value);
  }
});
</script>

<template>
  <DebugPane v-if="isDebugMode" />
  <router-view />
</template>

<style scoped lang="scss"></style>
