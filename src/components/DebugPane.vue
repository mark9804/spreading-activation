<script setup lang="ts">
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import { useRouter } from "vue-router";
import { computed } from "vue";

const store = useSpreadingActivationStore();
const router = useRouter();

const isPractice = computed(() => {
  return router.currentRoute.value.query.type === "0";
});

// 接收从父组件传递的属性
defineProps<{
  startTime?: number;
  responseTime?: number;
  currentStimulus?: any;
  isCorrect?: boolean;
}>();
</script>

<template>
  <div
    v-if="store.isDebugMode"
    absolute
    top-0
    left-0
    bg-black
    bg-opacity-10
    p-2
    rounded
    text-xs
    flex
    flex-col
  >
    <div>group: {{ store.getGroupType }}</div>
    <div>index: {{ store.currentTrialIndex }}</div>
    <div>round: {{ store.currentTrialRound }}</div>
    <div>currentItem: {{ store.getCurrentStimulusItem(isPractice).value }}</div>
    <div>
      isPractice: {{ isPractice }} ({{ router.currentRoute.value.query.type }})
    </div>
    <div>isExperimentComplete: {{ store.isExperimentComplete }}</div>
    <div>isDebugMode: {{ store.isDebugMode }}</div>
    ---
    <div>startTime: {{ startTime }}</div>
    <div>responseTime: {{ responseTime }}</div>
    <div>prime: {{ currentStimulus?.prime }}</div>
    <div>target: {{ currentStimulus?.target }}</div>
    <div>condition: {{ currentStimulus?.condition }}</div>
    <div>isCorrect: {{ isCorrect }}</div>
    <div class="debug-indicator" w-fit text-white px-2 py-1 font-bold mt-2>
      DEBUG MODE (双击ESC退出)
    </div>
  </div>
</template>

<style scoped>
.debug-indicator {
  background-color: rgba(255, 0, 0, 0.7);
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
