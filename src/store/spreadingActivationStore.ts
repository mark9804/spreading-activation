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

    // 从 sessionStorage 初始化 debugMode，如果没有则默认为 false
    const initialDebugMode = sessionStorage.getItem("isDebugMode") === "true";
    const debugMode = ref<boolean>(initialDebugMode);

    // 实验组别
    const groupType = ref<GroupType>(GroupType.B);
    const getGroupType = computed(() => groupType.value);
    function setGroupType(value: GroupType) {
      groupType.value = value;
    }

    // Calculate the lists once and store them in a simple const.
    const _calculatedFullTrialLists = (() => {
      console.log("[Store Setup] Initializing _calculatedFullTrialLists ONCE.");
      const SR_LIST_SHUFFLED = shuffle(SR_LIST.value);
      const NO_LIST_SHUFFLED = shuffle(NO_LIST.value);
      const UR_LIST_SHUFFLED = shuffle(UR_LIST.value);

      const SrLists = cluster(SR_LIST_SHUFFLED, SR_LIST_SHUFFLED.length / 3);
      const NoLists = cluster(NO_LIST_SHUFFLED, NO_LIST_SHUFFLED.length / 3);
      const UrLists = cluster(UR_LIST_SHUFFLED, UR_LIST_SHUFFLED.length / 3);

      return SrLists.map((srList, index) =>
        shuffle([...srList, ...NoLists[index], ...UrLists[index]])
      );
    })();

    const getFullTrialLists = computed(() => {
      // console.log("[getFullTrialLists] Accessing pre-calculated lists."); // Optional: uncomment for verbose logging
      return _calculatedFullTrialLists;
    });

    const currentTrialRound = ref(0); // 当前试次轮次，0<= x <= 2，大于 2 结束
    const currentTrialIndex = ref(0); // 当前试次索引，0<= x <= 39，大于 39 下一轮
    const trialResponses = ref<Result[]>([]);
    const trialResults = ref<Result[][]>([[], [], []]);

    const getResults = computed(() => trialResults.value);

    const getCurrentStimulusItem = (isPractice: boolean) => {
      // 在非练习模式下，当索引为0或1时，记录获取的刺激项
      if (
        !isPractice &&
        (currentTrialIndex.value === 0 || currentTrialIndex.value === 1)
      ) {
        // console.log(
        //   `[getCurrentStimulusItem] 获取刺激项 - 轮次: ${currentTrialRound.value}, 试次: ${currentTrialIndex.value}`
        // );
      }

      if (isPractice) {
        return computed(() => {
          if (currentTrialIndex.value < PRACTICE_LIST.value.length) {
            const item = PRACTICE_LIST.value[currentTrialIndex.value];
            // 练习模式的日志（如果需要）
            // console.log(`[Practice] Item:`, item);
            return item;
          }
          return null; // 练习完成
        });
      } else {
        return computed(() => {
          // 检查是否超出实验轮次范围
          if (currentTrialRound.value >= getFullTrialLists.value.length) {
            return null; // 实验已完成
          }

          // 检查是否超出当前轮次的试次范围
          const currentList = getFullTrialLists.value[currentTrialRound.value];
          if (currentTrialIndex.value >= currentList.length) {
            return null; // 当前轮次已完成
          }

          const item = currentList[currentTrialIndex.value];
          // 在非练习模式下，当索引为0或1时，记录获取的具体刺激项内容
          if (currentTrialIndex.value === 0 || currentTrialIndex.value === 1) {
            // console.log(
            //   `[getCurrentStimulusItem] -> Prime: ${item?.prime}, Target: ${item?.target}`
            // );
          }
          return item;
        });
      }
    };

    function newRound() {
      // 创建 trialResponses 的副本，而不是直接赋值引用
      trialResults.value[currentTrialRound.value] = [...trialResponses.value];
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
      // Log for the specific case: round 0, first few trials
      if (
        !isPractice &&
        currentTrialRound.value === 0 &&
        currentTrialIndex.value < 5
      ) {
        // Log first 5 trials of round 0
        // console.log(
        //   `[recordResponse] Pre-increment: Round: ${currentTrialRound.value}, Index: ${currentTrialIndex.value}. Recording response: Prime='${response.prime}', Target='${response.target}', Condition='${response.condition}', RT=${response.responseTime}, Correct=${response.isCorrect}`
        // );
      }

      // 检测并修正意外的初始状态问题
      if (
        currentTrialIndex.value > 0 &&
        trialResponses.value.length === 0 &&
        !isPractice
      ) {
        console.warn(
          `检测到状态不一致，重置试次索引: ${currentTrialIndex.value} -> 0`
        );
        currentTrialIndex.value = 0;
      }

      if (isPractice) {
        // 练习模式：只增加索引，不记录数据，也不调用newRound
        currentTrialIndex.value++;
      } else {
        trialResponses.value.push(response);
        // Log the actual stored item for the first few trials of round 0
        if (
          !isPractice &&
          currentTrialRound.value === 0 &&
          currentTrialIndex.value < 5
        ) {
          const recordedIdx = trialResponses.value.length - 1;
          if (trialResponses.value[recordedIdx]) {
            // Ensure item exists
            //  console.log(
            //     `[recordResponse] Post-push: Round: ${currentTrialRound.value}, Index (before increment): ${currentTrialIndex.value}. trialResponses[${recordedIdx}]: Prime='${trialResponses.value[recordedIdx].prime}', Target='${trialResponses.value[recordedIdx].target}'`
            //  );
          } else {
            // console.error(`[recordResponse] Error: trialResponses[${recordedIdx}] is undefined after push.`);
          }
        }
        currentTrialIndex.value++; // 在非练习模式下增加索引
      }

      const isRoundComplete = checkIsRoundComplete(isPractice);

      if (isRoundComplete && !isPractice) {
        // 只有在非练习模式下才调用newRound
        if (trialResponses.value.length < 40) {
          console.warn(
            `警告: 第${currentTrialRound.value}轮记录了${trialResponses.value.length}个响应，少于40个`
          );
        }
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
      // reset 时不改变 sessionStorage 中的 debugMode，允许调试状态跨重置持续
      // debugMode.value = false;
      // sessionStorage.removeItem("isDebugMode");
    }

    // 设置 debugMode 的方法
    function setDebugMode(value: boolean) {
      debugMode.value = value;
      if (value) {
        sessionStorage.setItem("isDebugMode", "true");
        console.log("Debug mode activated and saved to sessionStorage.");
      } else {
        sessionStorage.removeItem("isDebugMode");
        console.log("Debug mode deactivated and removed from sessionStorage.");
      }
    }

    // 获取 debugMode 的计算属性
    const isDebugMode = computed(() => debugMode.value);

    // 完全重置实验状态，确保从干净状态开始
    function resetExperimentState() {
      currentTrialRound.value = 0;
      currentTrialIndex.value = 0;
      trialResponses.value = [];
      // trialResults 不重置，以保留之前的数据（如果需要）
    }

    // 确保实验结束时所有数据都被保存
    function finalizeExperiment() {
      // 如果还有未保存的响应数据，保存它们
      if (trialResponses.value.length > 0 && currentTrialRound.value < 3) {
        trialResults.value[currentTrialRound.value] = [...trialResponses.value];
        trialResponses.value = [];
      }
    }

    // 添加调试函数 (保持不变或按需修改)
    function debugLogState() {
      console.log("=== Store State ===");
      console.log(
        `Round: ${currentTrialRound.value}, Index: ${currentTrialIndex.value}`
      );
      console.log(`Responses in current round: ${trialResponses.value.length}`);
      console.log("All Results:");
      trialResults.value.forEach((round, index) => {
        console.log(`  Round ${index}: ${round.length} items`);
      });
      console.log(`Experiment Complete: ${isExperimentComplete.value}`);
      console.log("===================");
    }

    // 在正式实验开始前重置试次索引（练习完成后可能不是0）
    function resetTrialIndex() {
      console.log(`重置试次索引: ${currentTrialIndex.value} -> 0`);
      currentTrialIndex.value = 0;
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
      debugMode, // 直接导出 ref
    };
  }
);
