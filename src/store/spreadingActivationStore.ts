import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Word, type Result, GroupType } from "@/types/Experiment";
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

    // 实验组别
    const groupType = ref<GroupType>(GroupType.B);
    const getGroupType = computed(() => groupType.value);
    function setGroupType(value: GroupType) {
      groupType.value = value;
    }

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
      return SrLists.map((srList, index) =>
        shuffle([...srList, ...NoLists[index], ...UrLists[index]])
      );
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
      // 创建 trialResponses 的副本，而不是直接赋值引用
      trialResults.value[currentTrialRound.value] = [...trialResponses.value];
      console.log(
        `第${currentTrialRound.value}轮数据已保存: ${trialResults.value[currentTrialRound.value].length}个`
      );

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
        // 练习模式：只增加索引，不记录数据，也不调用newRound
        currentTrialIndex.value++;
      } else {
        // 特别检查第一个响应
        if (currentTrialRound.value === 0 && currentTrialIndex.value === 0) {
          console.log(`🔥 记录第0轮第0个试次响应`);
        }

        trialResponses.value.push(response);

        // 在非练习模式下增加索引
        currentTrialIndex.value++;
      }

      const isRoundComplete = checkIsRoundComplete(isPractice);

      if (isRoundComplete && !isPractice) {
        // 只有在非练习模式下才调用newRound
        console.log(
          `第${currentTrialRound.value}轮完成，共${trialResponses.value.length}个响应`
        );
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

    // 添加调试函数
    function debugLogState() {
      console.log("=== Spreading Activation Store Debug ===");
      console.log("currentTrialRound:", currentTrialRound.value);
      console.log("currentTrialIndex:", currentTrialIndex.value);
      console.log("trialResponses.length:", trialResponses.value.length);
      console.log("trialResults:");
      trialResults.value.forEach((round, index) => {
        console.log(`  Round ${index}: ${round.length} items`);
        if (round.length > 0) {
          console.log(`    First item:`, round[0]);
          console.log(`    Last item:`, round[round.length - 1]);
        }
      });
      console.log("isExperimentComplete:", isExperimentComplete.value);
      console.log("=====================================");
    }

    // 在正式实验开始前重置试次索引（练习完成后可能不是0）
    function resetTrialIndex() {
      console.log(`重置试次索引: ${currentTrialIndex.value} -> 0`);
      currentTrialIndex.value = 0;
    }

    // 完全重置实验状态，确保从干净状态开始
    function resetExperimentState() {
      console.log("重置实验状态");
      currentTrialRound.value = 0;
      currentTrialIndex.value = 0;
      trialResponses.value = [];
      // 不重置 trialResults，因为可能已经有之前的数据
    }

    // 确保实验结束时所有数据都被保存
    function finalizeExperiment() {
      console.log("=== 最终数据统计 ===");

      // 如果还有未保存的响应数据，保存它们
      if (trialResponses.value.length > 0 && currentTrialRound.value < 3) {
        console.log(`保存最后一轮数据: ${trialResponses.value.length} 个响应`);
        trialResults.value[currentTrialRound.value] = [...trialResponses.value];
        trialResponses.value = [];
      }

      // 输出最终统计
      let totalResponses = 0;
      trialResults.value.forEach((round, index) => {
        console.log(`第${index}轮: ${round.length}个数据`);
        totalResponses += round.length;
      });
      console.log(`总数据量: ${totalResponses}`);
      console.log("=================");
    }

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
      getGroupType,
      setGroupType,
      debugLogState,
      resetTrialIndex,
      finalizeExperiment,
      resetExperimentState,
    };
  }
);
