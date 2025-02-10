<script setup lang="ts">
import RouteMapView from './components/RouteMapView.vue'
</script>

<template>
  <div class="app-container">
    <h1 class="title">Immersive Running Game</h1>
    <RouteMapView />
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  color: #2c3e50;
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 30px;
}

/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

/* Add more global styles as needed */
</style>