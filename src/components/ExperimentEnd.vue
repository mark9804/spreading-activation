<script setup lang="ts">
import xlsx from "json-as-xlsx";
import { json2csv } from "json-2-csv";
import { saveAs } from "file-saver";
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import { computed } from "vue";
import { flat } from "radashi";
import { useRouter } from "vue-router";
import { settings } from "@/settings";

const useStore = useSpreadingActivationStore();
const router = useRouter();

const result = computed(() => {
  const results = flat(useStore.getResults);

  // 获取所有可能的列名，但排除 'group' 字段
  const allKeys = [
    ...new Set(results.flatMap(result => Object.keys(result))),
  ].filter(key => key !== "group");

  // 从结果数据中移除 group 字段
  const filteredResults = results.map(result => {
    const { group, ...resultWithoutGroup } = result;
    return resultWithoutGroup;
  });

  return [
    {
      sheet: "Sheet1",
      columns: allKeys.map(key => ({
        label: key,
        value: key,
      })),
      content: filteredResults,
    },
  ];
});

function handleExport() {
  try {
    xlsx(result.value, {
      fileName: `実験データ-${new Date().toLocaleDateString()}`,
    });
  } catch (e) {
    // 失败了，转成 csv
    const csv = json2csv(result.value);
    saveAs(
      new Blob([csv], { type: "text/csv" }),
      `実験データ-${new Date().toLocaleDateString()}.csv`
    );
  }
}

function handleBackToHome() {
  const userConfirm = confirm(
    "ホームに戻りますか？\nこれまでの実験データは保存されません。"
  );
  if (userConfirm) {
    useStore.reset();
    router.push("/");
  }
}

function handleOpenForm() {
  window.open(settings.formUrl, "_blank");
}
</script>

<template>
  <div flex flex-col items-center justify-center h-screen>
    <h1 text-4xl font-bold>実験課題はこれで終わります</h1>
    <div mt-4 text-lg flex flex-col items-center justify-center gap-5>
      <a-button @click="handleExport"> ①データをエクセルで出力 </a-button>
      <a-button @click="handleOpenForm"> ②フォームズに回答する </a-button>
      <a-button
        type="dashed"
        status="danger"
        @click="handleBackToHome"
        class="!bg-gray-300"
      >
        ホームに戻る
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
