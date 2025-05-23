<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import type { Word, Result } from "@/types/Experiment";
import { Condition, Answer, ExperimentMode } from "@/types/Experiment";
import { sleep } from "@/utils/timeUtils";
import {
  initDebugMode,
  setupEscKeyHandler,
  checkAndStartDebugMode,
} from "@/utils/debugUtils";
import { setupDebugEvents } from "@/utils/debugEvents";
import {
  checkResponseCorrectness,
  calculateResponseTime,
  formatResponseTime,
} from "@/utils/experimentUtils";
import DebugPane from "./DebugPane.vue";

const route = useRoute();
const props = withDefaults(
  defineProps<{
    type?: ExperimentMode; // 0: practice, 1: experiment
    debugMode?: boolean;
  }>(),
  {
    debugMode: false,
  }
);

// 从 URL 查询参数中获取 debugMode
const urlDebugMode = computed(() => {
  return route.query.debugMode === "true";
});

const router = useRouter();
const store = useSpreadingActivationStore();

// 初始化 debug 模式
initDebugMode(props.debugMode || urlDebugMode.value);

const showStimulus = ref(false);
const showFeedback = ref(false);
const currentStimulus = ref<Word | null>(null);
const isCorrect = ref(false);
const responseTime = ref(0);
const startTime = ref(0);
const showPrime = ref(false);
const isPractice = computed(() => props.type === ExperimentMode.PRACTICE);

const FIXATION_TIME = 1500; // 注视点显示时间（毫秒）
const PRIME_TIME = 200; // 启动词显示时间（毫秒）
const FEEDBACK_TIME = 1500; // 反馈显示时间（毫秒，仅在练习模式下显示）

// 初始化试验
function initTrial(): void {
  showStimulus.value = false;
  showFeedback.value = false;
  showPrime.value = false;
  currentStimulus.value = null;
  startTime.value = 0;
}

// 开始单次试次
async function startTrial(): Promise<void> {
  initTrial();
  await sleep(100);

  // 显示注视点
  showStimulus.value = true;
  currentStimulus.value = {
    prime: "+",
    target: "+",
    condition: Condition.NO,
    answer: Answer.F,
  };
  await sleep(FIXATION_TIME);

  // 清空屏幕
  showStimulus.value = false;
  await sleep(100);

  // 显示启动词
  currentStimulus.value = store.getCurrentStimulusItem(isPractice.value).value;
  showStimulus.value = true;
  showPrime.value = true;
  await sleep(PRIME_TIME);

  // 清空屏幕
  showStimulus.value = false;
  showPrime.value = false;
  await sleep(100);

  // 显示目标词
  showStimulus.value = true;
  startTime.value = performance.now();
}

// 处理按键响应
async function handleKeyPress(event: KeyboardEvent): Promise<void> {
  // 处理特殊情况：
  // 1. 如果试次未开始，则不响应
  // 2. 如果试次已结束，则不响应
  // 3. 如果反馈已显示，则不响应
  // 4. 如果当前刺激为空，则不响应
  if (
    !showStimulus.value ||
    !startTime.value ||
    showFeedback.value ||
    !currentStimulus.value
  )
    return;

  // 进入一般情况
  if (event.key.toLowerCase() === "f" || event.key.toLowerCase() === "j") {
    const endTime = performance.now();
    responseTime.value = calculateResponseTime(endTime, startTime.value);

    // 判断正确性
    isCorrect.value = checkResponseCorrectness(
      event.key,
      currentStimulus.value,
      store.getGroupType
    );

    if (props.type === ExperimentMode.PRACTICE) {
      // 练习模式显示反馈
      showFeedback.value = true;
      await sleep(FEEDBACK_TIME);
      showFeedback.value = false;
      const isRoundComplete = store.recordResponse(
        {} as Result,
        isPractice.value
      );
      if (!isRoundComplete) {
        startTrial();
      } else {
        // 完成练习，跳转到正式开始前的准备页面
        router.push("/prepare-start");
      }
    } else {
      // 实验模式记录数据
      const result: Result = {
        prime: currentStimulus.value.prime,
        target: currentStimulus.value.target,
        response: event.key,
        responseTime: responseTime.value,
        condition: currentStimulus.value.condition,
        isCorrect: isCorrect.value,
        group: store.getGroupType,
      };
      store.recordResponse(result, isPractice.value);

      // 检查是否完成所有试次
      if (store.isExperimentComplete) {
        router.push("/end");
      } else {
        startTrial();
      }
    }
  }
}

// 设置事件监听器和清理函数
let cleanupEscHandler: (() => void) | null = null;
let cleanupDebugEvents: (() => void) | null = null;

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);

  // 设置 ESC 键处理
  cleanupEscHandler = setupEscKeyHandler();

  // 设置 debug 事件监听
  cleanupDebugEvents = setupDebugEvents();

  // 检查并启动 debug 模式
  checkAndStartDebugMode();

  // 如果是正式实验模式，重置试次索引（因为练习完成后索引可能不是0）
  if (!isPractice.value) {
    store.resetTrialIndex();
  }

  startTrial();
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
  <DebugPane
    :start-time="startTime"
    :response-time="responseTime"
    :current-stimulus="currentStimulus"
    :is-correct="isCorrect"
  />

  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      v-if="showStimulus && currentStimulus"
      class="text-7xl font-bold"
      :class="{ 'text-5xl font-thin': currentStimulus.prime === '+' }"
    >
      {{ showPrime ? currentStimulus.prime : currentStimulus.target }}
    </div>

    <div
      v-if="isPractice && showFeedback"
      class="practice-feedback text-center mt-4 text-4xl font-bold"
      :class="{ 'is-correct': isCorrect, 'is-incorrect': !isCorrect }"
    >
      <div class="mt-2 text-xs text-gray-100 font-normal text-center">
        反応時間: {{ formatResponseTime(responseTime) }}
      </div>
    </div>

    <div v-if="isPractice" class="fixed bottom-8 text-center text-gray-100">
      単語間に意味的な関連がある場合を（<span
        class="mx-1 px-3 py-1 bg-gray-400 rounded font-bold"
        >F</span
      >）、 意味的な関連がない場合を（<span
        class="mx-1 px-3 py-1 bg-gray-400 rounded font-bold"
        >J</span
      >）を押してください。
    </div>
  </div>
</template>

<style lang="scss" scoped>
.practice-feedback {
  &::after {
    @apply mt-8 text-xl font-bold;
  }

  &.is-correct::before {
    content: "正解です";
    @apply text-green-500;
  }
  &.is-incorrect::before {
    content: "間違います";
    @apply text-red-500;
  }
}
</style>
