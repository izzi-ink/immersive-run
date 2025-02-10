<script setup lang="ts">
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import { LMap, LTileLayer, LPolyline, LMarker } from "@vue-leaflet/vue-leaflet";

// Debug if components are imported
console.log("Map components:", { LMap, LTileLayer, LPolyline, LMarker });

const zoom = ref(15);
const position = ref<[number, number]>([35.689487, 162.691706]);
const route = ref<[number, number][]>([]);
const watchId = ref<number | null>(null);
const isRunning = ref(false);

onMounted(() => {
  console.log("Component mounted");
  // Get initial position
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log("Initial position:", pos.coords);
      position.value = [pos.coords.latitude, pos.coords.longitude];
    },
    (error) => console.error("Error getting position:", error)
  );
});

// ... rest of your component code
</script>

<template>
  <div class="container">
    <h2>GPS Tracker</h2>
    
    <!-- Debug info -->
    <div class="debug-info">
      <p>Map Center: {{ position }}</p>
      <p>Zoom Level: {{ zoom }}</p>
      <p>Route Points: {{ route.length }}</p>
    </div>

    <!-- Map container with explicit dimensions -->
    <div style="height: 400px; width: 100%; border: 2px solid red;">
      <LMap
        v-if="position[0] !== 0"
        :zoom="zoom"
        :center="position"
        style="height: 100%; width: 100%;"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LMarker :lat-lng="position" />
        <LPolyline
          v-if="route.length > 1"
          :lat-lngs="route"
          color="blue"
          :weight="3"
        />
      </LMap>
    </div>

    <!-- Rest of your template -->
  </div>
</template>