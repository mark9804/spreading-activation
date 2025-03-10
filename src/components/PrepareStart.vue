<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, onUnmounted } from "vue";
const router = useRouter();

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.code === "Space") {
    router.push("/experiment?type=1");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
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
