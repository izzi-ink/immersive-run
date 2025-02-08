<script setup lang="ts">
import { ref } from "vue";
import { saveRun, getRuns, clearRuns, RunData } from "../utils/db";

const isRunning = ref(false);
const startTime = ref<number | null>(null);
const elapsedTime = ref<string>("00:00");
const distance = ref<number>(0);
const storedRuns = ref<RunData[]>([]);
const watchId = ref<number | null>(null);
const lastPosition = ref<{ lat: number; lon: number } | null>(null);

function startRun() {
  isRunning.value = true;
  startTime.value = Date.now();
  distance.value = 0;
  elapsedTime.value = "00:00";
  lastPosition.value = null;

  watchId.value = navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;

    // Calculate distance from last position
    if (lastPosition.value) {
      const delta = haversineDistance(
        lastPosition.value.lat, lastPosition.value.lon, latitude, longitude
      );
      distance.value += delta;
    }

    lastPosition.value = { lat: latitude, lon: longitude };
    updateElapsedTime();
  });
}

function stopRun() {
  console.log("Stopping run...");

  if (watchId.value !== null) {
    navigator.geolocation.clearWatch(watchId.value);
    watchId.value = null;
  }

  if (startTime.value) {
    updateElapsedTime();
  }

  isRunning.value = false;

  console.log("Run stopped. Distance:", distance.value, "Elapsed Time:", elapsedTime.value);
}


function updateElapsedTime() {
  if (startTime.value) {
    const elapsed = Math.floor((Date.now() - startTime.value) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");
    elapsedTime.value = `${minutes}:${seconds}`;
  }
}

async function saveCurrentRun() {
  if (!startTime.value) return;
  const runData: RunData = {
    date: new Date().toISOString(),
    distance: parseFloat(distance.value.toFixed(2)),
    duration: elapsedTime.value,
  };
  await saveRun(runData);
  console.log("Run saved:", runData);
}

async function loadRuns() {
  storedRuns.value = await getRuns();
}

async function clearAllRuns() {
  await clearRuns();
  storedRuns.value = [];
}

// Haversine formula to calculate distance between two GPS points
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); // Distance in km
}
</script>

<template>
  <div>
    <h2>Run Tracker</h2>
    
    <button v-if="!isRunning" @click="startRun">Start Run</button>
    <button v-if="isRunning" @click="stopRun">Stop Run</button>

    <p v-if="isRunning">⏱ Time: {{ elapsedTime }}</p>
    <p v-if="!isRunning && distance > 0">🏃‍♀️ Distance: {{ distance.toFixed(2) }} km</p>

    <div v-if="!isRunning && distance > 0">
        <button @click="saveCurrentRun">Save Run</button>
        <button @click="distance = 0; elapsedTime = '00:00'">Discard</button>
    </div>


    <h3>Past Runs</h3>
    <button @click="loadRuns">Load Runs</button>
    <button @click="clearAllRuns">Clear Runs</button>
    
    <ul>
      <li v-for="run in storedRuns" :key="run.id">
        {{ run.date }} - {{ run.distance.toFixed(2) }} km in {{ run.duration }}
      </li>
    </ul>
  </div>
</template>
