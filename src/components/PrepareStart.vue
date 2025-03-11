<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, onUnmounted, computed } from "vue";
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import DebugPane from "./DebugPane.vue";
import { setupDebugEvents } from "@/utils/debugEvents";
import { setupEscKeyHandler } from "@/utils/debugUtils";

const router = useRouter();
const store = useSpreadingActivationStore();

const isDebugMode = computed(() => store.isDebugMode);

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.code === "Space") {
    router.push("/experiment?type=1");
  }
};

// 设置事件监听器和清理函数
let cleanupEscHandler: (() => void) | null = null;
let cleanupDebugEvents: (() => void) | null = null;

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);

  // 设置 ESC 键处理
  cleanupEscHandler = setupEscKeyHandler();

  // 设置 debug 事件监听
  cleanupDebugEvents = setupDebugEvents();

  if (isDebugMode.value) {
    // 等待 1000ms 后，自动跳转
    setTimeout(() => {
      router.push("/experiment?type=1");
    }, 1000);
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);

  // 清理 ESC 键处理
  if (cleanupEscHandler) {
    cleanupEscHandler();
  }

  // 清理 debug 事件监听
  if (cleanupDebugEvents) {
    cleanupDebugEvents();
  }
});
</script>

<template>
  <DebugPane />
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold">練習はこれで終わります</h1>
    <div mt-4 text-lg flex items-center justify-center>
      <kbd
        mr-2
        px-2
        py-1.5
        text-xs
        font-semibold
        bg-gray-400
        border
        border-gray-200
        rounded-lg
      >
        スペース</kbd
      >キーを押して、実験を開始してください。
    </div>
  </div>
</template>
