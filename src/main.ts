import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// Register the PWA service worker
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

createApp(App).mount("#app");
