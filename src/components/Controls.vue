<script setup>
import {storeToRefs} from "pinia";
import {useControlsStore} from "@/stores/controls.js";
const controlsStore = useControlsStore()
const { numberOfPoints, fractalType, backgroundTheme, fractalColor, resetCamera } = storeToRefs(controlsStore)

</script>

<template>
  <div class="controls"
       :class="{ 'controls-dark': backgroundTheme === 'dark', 'controls-white': backgroundTheme === 'white' }">
    <div class="control">
      <div class="controls-label">Fractal Type:</div>
      <select v-model="fractalType" class="select-input">
        <option value="triangle">Sierpinski triangle</option>
        <option value="square">Square, no previous</option>
        <option value="pentagon">Pentagon with r = 1/3</option>
        <option value="pentagon_r0_5">Pentagon with r = 1/2, no previous</option>
        <option value="hexagon">Hexagon with r = 3/8</option>
        <option value="heptagon_r1_4">Heptagon r = 1.4</option>
        <option value="heptagon_r2">Heptagon r = 2</option>
        <option value="tetrahedron">Sierpinski tetrahedron</option>
      </select>
    </div>
    <div class="control">
      <div class="controls-label">Background:</div>
      <select v-model="fractalColor" class="select-input">
        <option value="hsl">HSL</option>
        <option value="rgb">RGB</option>
        <option value="grayscale">Grayscale</option>
        <option value="rainbow">Rainbow</option>
        <option value="fire">Fire</option>
      </select>
    </div>
    <div class="control">
      <div class="controls-label">Number of Points:</div>
      <select v-model="numberOfPoints" class="select-input">
        <option :value="1">1</option>
        <option :value="10">10</option>
        <option :value="100">100</option>
        <option :value="1000">1'000</option>
        <option :value="10000">10'000</option>
        <option :value="100000">100'000</option>
        <option :value="1000000">1'000'000</option>
        <option :value="2000000">2'000'000</option>
        <option :value="4000000">4'000'000</option>
      </select>
    </div>
    <div class="control">
      <div class="controls-label">Background:</div>
      <select v-model="backgroundTheme" class="select-input">
        <option value="dark">Dark</option>
        <option value="white">White</option>
      </select>
    </div>
    <div class="control">
      <button @click="resetCamera = !resetCamera" class="reset-button">
        Reset Camera
      </button>
    </div>
  </div>
</template>

<style scoped>
.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  transition: background-color 0.3s ease, color 0.3s ease;
  max-width: 400px;
}

.controls-dark {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
}

.controls-white {
  background-color: rgba(255, 255, 255, 0.7);
  color: black;
}

.control {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.controls-label {
  margin-right: 15px;
  width: 190px;
  text-align: right;
  font-size: 14px;
}

.select-input {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
  min-width: 150px;
  font-size: 14px;
  width: 100%;
}

.controls-white .select-input {
  background-color: #f0f0f0;
  color: black;
  border: 1px solid #ccc;
}

.reset-button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background-color: #4a5568;
  color: white;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #2d3748;
}

.controls-white .reset-button {
  background-color: #e2e8f0;
  color: #1a202c;
}

.controls-white .reset-button:hover {
  background-color: #cbd5e0;
}

@media (max-width: 600px) {
  .controls {
    top: 10px;
    left: 10px;
    right: 10px;
    padding: 10px;
    max-width: none;
  }

  .controls-label {
    width: 80px;
    font-size: 12px;
  }

  .control-number-of-points {
    font-size: 12px;
  }

  .select-input {
    min-width: 100px;
    font-size: 12px;
  }

  .slider {
    width: 100%;
    max-width: none;
  }

  .reset-button {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>