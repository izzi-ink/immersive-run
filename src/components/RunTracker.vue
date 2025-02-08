<script setup lang="ts">
import { ref } from "vue";
import { saveRun, getRuns, clearRuns, RunData } from "../utils/db";

const distance = ref<number>(0);
const duration = ref<string>("");
const storedRuns = ref<RunData[]>([]);

// Save a new run
async function saveCurrentRun() {
  const runData: RunData = {
    date: new Date().toISOString(),
    distance: distance.value,
    duration: duration.value,
  };
  await saveRun(runData);
  console.log("Run saved:", runData);
}

// Load previous runs
async function loadRuns() {
  storedRuns.value = await getRuns();
}

// Clear runs (debugging)
async function clearAllRuns() {
  await clearRuns();
  storedRuns.value = [];
}
</script>

<template>
  <div>
    <h2>Run Tracker</h2>
    <input v-model="distance" type="number" placeholder="Distance (km)" />
    <input v-model="duration" type="text" placeholder="Duration (e.g., 30 mins)" />
    
    <button @click="saveCurrentRun">Save Run</button>
    <button @click="loadRuns">Load Runs</button>
    <button @click="clearAllRuns">Clear Runs</button>

    <ul>
      <li v-for="run in storedRuns" :key="run.id">
        {{ run.date }} - {{ run.distance }} km in {{ run.duration }}
      </li>
    </ul>
  </div>
</template>
