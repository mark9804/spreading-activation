<script setup lang="ts">
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import { useRouter } from "vue-router";
import { computed } from "vue";

const store = useSpreadingActivationStore();
const router = useRouter();

const isPractice = computed(() => {
  return router.currentRoute.value.query.type === "0";
});
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full">
    <div>
      <div>index: {{ store.currentTrialIndex }}</div>
      <div>round: {{ store.currentTrialRound }}</div>
      <div>currentItem: {{ store.getCurrentStimulusItem(true).value }}</div>
      <div>
        isPractice: {{ isPractice }} ({{
          router.currentRoute.value.query.type
        }})
      </div>
      <div>isExperimentComplete: {{ store.isExperimentComplete }}</div>
    </div>
  </div>
</template>
