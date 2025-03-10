import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Word, type Result, Condition, Answer } from "@/types/Experiment";
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

    const getFullTrialLists = computed(() => {
      // 打乱顺序
      const SR_LIST_SHUFFLED = shuffle(SR_LIST.value);
      const NO_LIST_SHUFFLED = shuffle(NO_LIST.value);
      const UR_LIST_SHUFFLED = shuffle(UR_LIST.value);

      // 把三个 List 全部三等分
      const SrLists = cluster(SR_LIST_SHUFFLED, 10);
      const NoLists = cluster(NO_LIST_SHUFFLED, 20);
      const UrLists = cluster(UR_LIST_SHUFFLED, 10);

      // 整合成三个 40 个试次的 List
      return SrLists.map((srList, index) => [
        ...srList,
        ...NoLists[index],
        ...UrLists[index],
      ]);
    });

    const getNextPracticeStimulus = computed(() => {
      const res = PRACTICE_LIST.value.pop();
      return res || null;
    });

    const currentTrialRound = ref(0); // 当前试次轮次，0<= x <= 2，大于 2 结束
    const currentTrialIndex = ref(0); // 当前试次索引，0<= x <= 39，大于 39 下一轮
    const trialResponses = ref<Result[]>([]);
    const trialResults = ref<Result[][]>([[], [], []]);

    const getCurrentStimulus = computed(() => {
      return getFullTrialLists.value[currentTrialRound.value][
        currentTrialIndex.value
      ];
    });

    function newRound() {
      currentTrialRound.value++;
      currentTrialIndex.value = 0;
      trialResults.value[currentTrialRound.value] = trialResponses.value;
      trialResponses.value = [];
    }

    function checkNextTrial() {
      if (currentTrialIndex.value >= 39) {
        newRound();
      } else {
        currentTrialIndex.value++;
      }
    }

    function recordResponse(response: Result) {
      trialResponses.value.push(response);
      checkNextTrial();
    }

    const isExperimentComplete = computed(() => {
      return currentTrialIndex.value >= PRACTICE_LIST.value.length;
    });

    return {
      currentTrialIndex,
      practiceList: PRACTICE_LIST,
      fullTrialLists: getFullTrialLists,
      getCurrentStimulus,
      getNextPracticeStimulus,
      recordResponse,
      isExperimentComplete,
    };
  }
);
