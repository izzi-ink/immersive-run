<script setup lang="ts">
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPolyline, LMarker } from "@vue-leaflet/vue-leaflet";
import { saveRun, getRuns, clearRuns, type RunData } from '../utils/db';

const zoom = ref(15);
const position = ref<[number, number]>([35.689487, 162.691706]);
const route = ref<[number, number][]>([]);
const watchId = ref<number | null>(null);
const isRunning = ref(false);
const startTime = ref<number | null>(null);
const pastRuns = ref<RunData[]>([]);
const selectedRun = ref<RunData | null>(null);

// Convert route array for storage
function convertRouteForStorage(route: [number, number][]): Array<{lat: number, lng: number}> {
  return route.map(([lat, lng]) => ({ lat, lng }));
}

// Convert stored route back to array format for Leaflet
function convertRouteForDisplay(route: Array<{lat: number, lng: number}>): [number, number][] {
  return route.map(point => [point.lat, point.lng]);
}

async function saveCurrentRun() {
  if (route.value.length === 0) return;
  
  const runData: RunData = {
    date: new Date().toISOString(),
    route: convertRouteForStorage(route.value),
    distance: calculateDistance(route.value),
    duration: calculateDuration(),
  };

  await saveRun(runData);
  console.log("Run saved:", runData);
  await loadRuns(); // Refresh the list
}

async function loadRuns() {
  pastRuns.value = await getRuns();
  console.log("Loaded runs:", pastRuns.value);
}

function viewRun(run: RunData) {
  selectedRun.value = run;
  const convertedRoute = convertRouteForDisplay(run.route);
  position.value = convertedRoute[0]; // Center map on run start
  route.value = convertedRoute;
}

async function clearAllRuns() {
  await clearRuns();
  pastRuns.value = [];
  selectedRun.value = null;
  route.value = [];
}

function calculateDistance(routePoints: [number, number][]): number {
  // Simple distance calculation - can be improved
  return Number((routePoints.length * 0.01).toFixed(2));
}

function calculateDuration(): string {
  if (!startTime.value) return "00:00";
  const elapsed = Math.floor((Date.now() - startTime.value) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTracking() {
  console.log("Starting GPS tracking...");
  isRunning.value = true;
  startTime.value = Date.now();
  route.value = [];

  if (navigator.geolocation) {
    watchId.value = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        position.value = [latitude, longitude];
        route.value = [...route.value, [latitude, longitude]];
      },
      (error) => {
        console.error("GPS Error:", error);
      },
      { enableHighAccuracy: true }
    );
  }
}

function stopTracking() {
  if (watchId.value) {
    navigator.geolocation.clearWatch(watchId.value);
    watchId.value = null;
  }
  isRunning.value = false;
}

// Load past runs when component mounts
onMounted(async () => {
  await loadRuns();
});


</script>

<template>
  <div class="container">
    <h2>GPS Tracker</h2>
    
    <!-- Map container -->
    <div class="map-container">
      <LMap
        :zoom="zoom"
        :center="position"
        style="height: 400px; width: 100%"
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

    <!-- Controls -->
    <div class="controls">
      <button v-if="!isRunning" @click="startTracking" class="start-button">
        Start Run
      </button>
      <button v-if="isRunning" @click="stopTracking" class="stop-button">
        Stop Run
      </button>
    </div>

    <!-- Save/Discard Options -->
    <div v-if="!isRunning && route.length > 0" class="controls">
      <button @click="saveCurrentRun" class="save-button">Save Run</button>
      <button @click="route = []" class="discard-button">Discard</button>
    </div>

    <!-- Past Runs -->
    <div class="past-runs" v-if="pastRuns.length > 0">
      <h3>Past Runs</h3>
      <div class="runs-list">
        <div v-for="run in pastRuns" :key="run.id" class="run-item">
          <button @click="viewRun(run)" class="view-button">
            {{ new Date(run.date).toLocaleDateString() }} - 
            {{ run.distance }}km in {{ run.duration }}
          </button>
        </div>
      </div>
      <div class="controls">
        <button @click="clearAllRuns" class="clear-button">Clear All Runs</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.map-container {
  border: 2px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
}

.controls {
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.start-button {
  background: #4CAF50;
  color: white;
}

.stop-button {
  background: #f44336;
  color: white;
}

.coordinates {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
}
.past-runs {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.past-runs h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
}

.save-button {
  background: #2196F3;
  color: white;
}
.save-button:hover {
  background: #1976D2;
}

.discard-button {
  background: #9e9e9e;
  color: white;
}

.discard-button:hover {
  background: #757575;
}

.load-button {
  background: #FF9800;
  color: white;
}

.load-button:hover {
  background: #F57C00;
}

.clear-button {
  background: #757575;
  color: white;
}

.clear-button:hover {
  background: #616161;
}
.runs-list {
  margin: 15px 0;
}

.run-item {
  margin: 8px 0;
}

.view-button {
  width: 100%;
  text-align: left;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 10px;
  border-radius: 4px;
  color: #495057;
}

.view-button:hover {
  background: #e9ecef;
}
</style>
