import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.scss";
import App from "./App.vue";
import "virtual:uno.css";
import { routerConvert } from "@/routes/routes";
import { eventBus } from "@/eventBus";
import "@unocss/reset/normalize.css";

const pinia = createPinia();

document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    eventBus.emit("enterKeyPressed");
  }
});

createApp(App).use(pinia).use(routerConvert).mount("#app");
