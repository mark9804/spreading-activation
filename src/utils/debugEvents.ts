import { eventBus } from "@/eventBus";
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";
import { startAutoKeyPress, stopAutoKeyPress } from "./debugUtils";

// 设置 debug 事件监听
export function setupDebugEvents() {
  const store = useSpreadingActivationStore();

  // 监听 debug 模式激活事件
  eventBus.on("enterDebugMode", () => {
    // 切换 debug 模式
    store.setDebugMode(!store.isDebugMode);

    if (store.isDebugMode) {
      startAutoKeyPress();
    } else {
      stopAutoKeyPress();
    }
  });

  // 返回清理函数
  return () => {
    eventBus.off("enterDebugMode");
    stopAutoKeyPress();
  };
}
