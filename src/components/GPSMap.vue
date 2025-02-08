<script setup lang="ts">
import { ref, onMounted } from "vue";

const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      latitude.value = position.coords.latitude;
      longitude.value = position.coords.longitude;
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
</script>

<template>
  <div>
    <h2>GPS Tracker</h2>
    <p v-if="latitude !== null && longitude !== null">
      🌍 Your location: <br>
      Latitude: {{ latitude }} <br>
      Longitude: {{ longitude }}
    </p>
    <p v-else>Getting your location...</p>
  </div>
</template>
