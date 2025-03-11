import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";
import { useSpreadingActivationStore } from "@/store/spreadingActivationStore";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/instruction?page=1",
  },
  {
    path: "/instruction",
    name: "ExpInstruct",
    component: () => import("@/components/ExpInstruct.vue"),
    props: route => ({ page: parseInt(route.query.page as string) || 1 }),
  },
  {
    path: "/experiment",
    name: "Experiment",
    component: () => import("@/components/Experiment.vue"),
    props: route => ({ type: parseInt(route.query.type as string) || 0 }),
  },
  {
    path: "/prepare-start",
    name: "PrepareStart",
    component: () => import("@/components/PrepareStart.vue"),
  },
  {
    path: "/end",
    name: "ExperimentEnd",
    component: () => import("@/components/ExperimentEnd.vue"),
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// 添加全局导航守卫
routerConvert.beforeEach((to, from, next) => {
  // 检查是否从实验页面离开
  if (from.path.includes("/experiment")) {
    const store = useSpreadingActivationStore();

    // 如果实验未完成且不是导航到结束页面或准备开始页面，则显示确认对话框
    if (
      !store.isExperimentComplete &&
      !to.path.includes("/end") &&
      !to.path.includes("/prepare-start")
    ) {
      const confirmed = window.confirm(
        "また実験は完了していません。ページから離れると実験が中断されます。\nよろしいですか？"
      );
      if (confirmed) {
        next(); // 用户确认离开
      } else {
        next(false); // 取消导航
      }
    } else {
      next(); // 实验已完成或导航到结束页面或准备开始页面，允许离开
    }
  } else {
    next(); // 不是从实验页面离开，允许导航
  }
});

export { routerConvert, routes };
