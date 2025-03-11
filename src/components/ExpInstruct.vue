<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { isNumber } from "radashi";
import INST1 from "@/assets/INST1.jpg";
import INST2 from "@/assets/INST2.jpg";
import INST3 from "@/assets/INST3.jpg";
import DebugPane from "./DebugPane.vue";

const props = defineProps<{
  page: number;
}>();

const router = useRouter();

const instructionContent = computed(() => {
  switch (props.page) {
    case 1:
      return {
        image: INST1,
      };
    case 2:
      return {
        image: INST2,
      };
    case 3:
      return {
        image: INST3,
      };
    default:
      return {
        image: INST1,
      };
  }
});

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.code === "Space") {
    event.preventDefault(); // 防止页面滚动
    if (props.page >= 3 || !isNumber(props.page)) {
      router.push("/experiment?type=0");
    } else if (props.page < 3) {
      router.push(`/instruction?page=${props.page + 1}`);
    }
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
  <DebugPane />

  <div class="instruction-container">
    <img
      :src="instructionContent.image"
      alt="Instruction Image"
      class="instruction-image"
    />
  </div>
</template>

<style scoped lang="scss">
.instruction-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .instruction-image {
    max-width: 100%;
    height: auto;
    margin-bottom: 2rem;
  }

  .hint-text {
    font-size: 1.2rem;
    color: #666;
    text-align: center;
  }
}
</style>
