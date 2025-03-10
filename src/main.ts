import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.scss";
import App from "./App.vue";
import "virtual:uno.css";
import { routerConvert } from "@/routes/routes";
import "@unocss/reset/normalize.css";

const pinia = createPinia();

createApp(App).use(pinia).use(routerConvert).mount("#app");
