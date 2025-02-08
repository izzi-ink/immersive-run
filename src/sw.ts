/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

// Tell TypeScript that `self.__WB_MANIFEST` is available
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

precacheAndRoute(self.__WB_MANIFEST || []);
