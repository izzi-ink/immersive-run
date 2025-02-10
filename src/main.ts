import { createApp } from 'vue'
import App from './App.vue'
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon loading issue
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/node_modules/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: '/node_modules/leaflet/dist/images/marker-icon.png',
  shadowUrl: '/node_modules/leaflet/dist/images/marker-shadow.png',
});

createApp(App).mount('#app')