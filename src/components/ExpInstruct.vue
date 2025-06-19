<script setup lang="tsx">
import { computed, onMounted, onUnmounted, Fragment } from "vue";
import { useRouter } from "vue-router";
import { isNumber } from "radashi";
import INST1 from "@/assets/INST1.png";
import INST2 from "@/assets/INST2.png";
import DebugPane from "./DebugPane.vue";

const props = defineProps<{
  page: number;
}>();

const router = useRouter();

const instructionContent = computed(() => {
  switch (props.page) {
    case 1:
      return (
        <Fragment>
          <h1>説明</h1>
          <img src={INST1} class="instruction-image" alt="Instruction Image" />
        </Fragment>
      );
    case 2:
      return (
        <Fragment>
          <h1>説明</h1>
          <img src={INST2} class="instruction-image" alt="Instruction Image" />
        </Fragment>
      );
    case 3:
      return (
        <Fragment>
          <h1 class="text-center mb-6">これから練習が始まります</h1>
          <div class="text-xl flex flex-col gap-2">
            <p>
              <kbd>F</kbd>キーに左手の人差し指を、
            </p>
            <p>
              <kbd>J</kbd>キーに右手の人差し指を、軽く乗せてください。
            </p>
            <br />
            <p>
              「<b>意味的に関連がある場合</b>」は<kbd>F</kbd>キー、
            </p>
            <p>
              「<b>意味的に関連がない場合</b>」は<kbd>J</kbd>キーです。
            </p>
            <br />
            <p>刺激を見逃さないように、集中して課題に取り組んでください。</p>
            <br />
            <p>
              <kbd>スペース</kbd>キーを押すと、練習が始まります。
            </p>
          </div>
        </Fragment>
      );
    default:
      return <img src={INST1} alt="Instruction Image" />;
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

  <div class="instruction-container flex flex-col items-center justify-center">
    <instructionContent />
  </div>

  <div class="fixed bottom-8 text-center w-full text-xl">
    <kbd>スペース</kbd>キーを押して続く
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
kbd {
  @apply mx-1 px-3 py-1 bg-gray-400 rounded font-bold;
}
</style>
