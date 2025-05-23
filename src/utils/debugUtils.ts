import { ref } from "vue";
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";

// debug 模式，每隔 200±50 ms 按一次 f 或 j 键（各50%概率）
let debugInterval: number | null = null;

// 创建一个模拟按键的函数
export function simulateKeyPress(key: string) {
  const keyEvent = new KeyboardEvent("keydown", {
    key: key,
    code: key === "f" ? "KeyF" : "KeyJ",
    keyCode: key === "f" ? 70 : 74,
    which: key === "f" ? 70 : 74,
    bubbles: true,
    cancelable: true,
  });

  document.dispatchEvent(keyEvent);
}

// 随机延迟函数，返回 200±50 ms 的随机值
export function getRandomDelay(): number {
  return 200 + Math.floor(Math.random() * 101) - 50; // 150-250 ms
}

// 随机选择按键（f或j，各50%概率）
export function getRandomKey(): string {
  return Math.random() < 0.5 ? "f" : "j";
}

// 启动自动按键
export function startAutoKeyPress() {
  const store = useSpreadingActivationStore();

  if (debugInterval) {
    clearTimeout(debugInterval);
    debugInterval = null;
  }

  // 添加延迟，确保实验组件完全加载后再开始自动按键
  console.log("自动按键模式：等待2秒后开始...");

  setTimeout(() => {
    if (!store.isDebugMode) return;

    console.log("自动按键模式：开始执行");

    // @ts-ignore
    let lastPressTime = Date.now();
    let keyPressCount = 0;
    let consecutiveErrorCount = 0;

    // 使用递归setTimeout而不是setInterval，以便每次都有不同的延迟
    function pressKey() {
      try {
        // 检查是否仍处于调试模式
        if (!store.isDebugMode) {
          console.log("调试模式已禁用，停止自动按键");
          return;
        }

        // 检查实验是否已完成
        if (store.isExperimentComplete) {
          console.log("实验已完成，停止自动按键");
          return;
        }

        // 随机选择按f或j键
        const key = getRandomKey();
        simulateKeyPress(key);
        keyPressCount++;

        // 记录按键情况，每10次打印一次
        if (keyPressCount % 10 === 0) {
          console.log(`已自动按键 ${keyPressCount} 次`);
        }

        const now = Date.now();
        lastPressTime = now;
        consecutiveErrorCount = 0;

        const delay = getRandomDelay();
        debugInterval = window.setTimeout(pressKey, delay);
      } catch (error) {
        consecutiveErrorCount++;
        console.error("自动按键出错：", error);

        // 如果连续错误超过5次，放弃自动按键
        if (consecutiveErrorCount >= 5) {
          console.error("自动按键连续出错，停止");
          return;
        }

        // 出错后1秒后重试
        debugInterval = window.setTimeout(pressKey, 1000);
      }
    }

    // 开始第一次按键
    debugInterval = window.setTimeout(pressKey, getRandomDelay());
  }, 2000); // 延迟2秒
}

// 停止自动按键
export function stopAutoKeyPress() {
  if (debugInterval) {
    clearTimeout(debugInterval);
    debugInterval = null;
    console.log("自动按键已停止");
  }
}

// 处理ESC键退出debug模式
export function setupEscKeyHandler() {
  const store = useSpreadingActivationStore();
  const lastEscTime = ref(0);

  function handleEscKey(event: KeyboardEvent): void {
    if (event.key === "Escape" && store.isDebugMode) {
      const now = Date.now();
      if (now - lastEscTime.value < 1000) {
        // 1秒内连续按下两次ESC，退出debug模式
        store.setDebugMode(false);
        stopAutoKeyPress();
        console.log("Debug mode deactivated by double ESC");
      }
      lastEscTime.value = now;
    }
  }

  // 添加事件监听器
  window.addEventListener("keydown", handleEscKey);

  // 返回清理函数
  return () => {
    window.removeEventListener("keydown", handleEscKey);
  };
}

// 初始化 debug 模式
export function initDebugMode(isDebugMode: boolean) {
  const store = useSpreadingActivationStore();

  if (import.meta.env.DEV && isDebugMode) {
    store.setDebugMode(true);
  }
}

// 检查并启动 debug 模式
export function checkAndStartDebugMode() {
  const store = useSpreadingActivationStore();

  if (import.meta.env.DEV && store.isDebugMode) {
    startAutoKeyPress();
    return true;
  }

  return false;
}
