import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Word, type Result } from "@/types/Experiment";
import { practiceWordList } from "./practiceList";
import { SRList, NOList, URList } from "./trialList";
import { cluster, shuffle } from "radashi";

export const useSpreadingActivationStore = defineStore(
  "spreading-activation-store",
  () => {
    const PRACTICE_LIST = ref<Word[]>(practiceWordList);
    const SR_LIST = ref<Word[]>(SRList); // 长度30
    const NO_LIST = ref<Word[]>(NOList); // 长度30
    const UR_LIST = ref<Word[]>(URList); // 长度60

    // 添加 debugMode 状态
    const debugMode = ref(false);

    const getFullTrialLists = computed(() => {
      // 打乱顺序
      const SR_LIST_SHUFFLED = shuffle(SR_LIST.value);
      const NO_LIST_SHUFFLED = shuffle(NO_LIST.value);
      const UR_LIST_SHUFFLED = shuffle(UR_LIST.value);

      // 把三个 List 全部三等分
      const SrLists = cluster(SR_LIST_SHUFFLED, SR_LIST_SHUFFLED.length / 3);
      const NoLists = cluster(NO_LIST_SHUFFLED, NO_LIST_SHUFFLED.length / 3);
      const UrLists = cluster(UR_LIST_SHUFFLED, UR_LIST_SHUFFLED.length / 3);

      // 整合成三个 40 个试次的 List
      return SrLists.map((srList, index) => [
        ...srList,
        ...NoLists[index],
        ...UrLists[index],
      ]);
    });

    const currentTrialRound = ref(0); // 当前试次轮次，0<= x <= 2，大于 2 结束
    const currentTrialIndex = ref(0); // 当前试次索引，0<= x <= 39，大于 39 下一轮
    const trialResponses = ref<Result[]>([]);
    const trialResults = ref<Result[][]>([[], [], []]);

    const getResults = computed(() => trialResults.value);

    const getCurrentStimulusItem = (isPractice: boolean) => {
      if (isPractice) {
        return computed(() => PRACTICE_LIST.value[currentTrialIndex.value]);
      } else {
        return computed(
          () =>
            getFullTrialLists.value[currentTrialRound.value][
              currentTrialIndex.value
            ]
        );
      }
    };

    function newRound() {
      trialResults.value[currentTrialRound.value] = trialResponses.value;
      trialResponses.value = [];
      currentTrialRound.value++;
      currentTrialIndex.value = 0;
    }

    function checkIsRoundComplete(isPractice: boolean) {
      if (isPractice) {
        return currentTrialIndex.value >= PRACTICE_LIST.value.length;
      } else {
        return (
          currentTrialIndex.value >=
          getFullTrialLists.value[currentTrialRound.value].length
        );
      }
    }

    /**
     * 记录响应
     * @param {Result} response 响应
     * @param {boolean} isPractice 是否为练习
     * @returns {boolean} 是否完成一轮: boolean
     */
    function recordResponse(response: Result, isPractice: boolean) {
      if (isPractice) {
      } else {
        trialResponses.value.push(response);
      }

      currentTrialIndex.value++;
      const isRoundComplete = checkIsRoundComplete(isPractice);
      if (isRoundComplete) {
        newRound();
      }
      return isRoundComplete;
    }

    const isExperimentComplete = computed(() => {
      return currentTrialRound.value >= 3;
    });

    function reset() {
      currentTrialIndex.value = 0;
      currentTrialRound.value = 0;
      trialResponses.value = [];
      trialResults.value = [[], [], []];
      debugMode.value = false; // 重置时也重置 debugMode
    }

    // 设置 debugMode 的方法
    function setDebugMode(value: boolean) {
      debugMode.value = value;
    }

    // 获取 debugMode 的计算属性
    const isDebugMode = computed(() => debugMode.value);

    return {
      currentTrialIndex,
      currentTrialRound,
      practiceList: PRACTICE_LIST,
      fullTrialLists: getFullTrialLists,
      recordResponse,
      isExperimentComplete,
      getCurrentStimulusItem,
      getResults,
      reset,
      setDebugMode,
      isDebugMode,
    };
  }
);
