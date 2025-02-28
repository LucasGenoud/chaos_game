<template>
  <div class="canvas" id="canvas"></div>
  <div v-if="loading" class="loading">LOADING</div>
  <div class="controls"
       :class="{ 'controls-dark': backgroundTheme === 'dark', 'controls-white': backgroundTheme === 'white' }">
    <div class="control">
      <div class="controls-label">Fractal Type:</div>
      <select v-model="shapeType" @change="resetScene" class="select-input">
        <option value="sierpinskiTriangle">Sierpinski Triangle</option>
        <option value="sierpinskiPyramid">Sierpinski Pyramid</option>
      </select>
    </div>
    <div class="control">
      <div class="controls-label">Number of Points:</div>
      <input @change="resetScene" v-model="numberOfPoints" type="range" min="1" :max="maxNumberOfPoints" :value="minNumberOfPoints"
             class="slider">
      <div class="control-number-of-points">{{ numberOfPoints }}</div>
    </div>
    <div class="control">
      <div class="controls-label">Background:</div>
      <select v-model="backgroundTheme" class="select-input">
        <option value="dark">Dark</option>
        <option value="white">White</option>
      </select>
    </div>
  </div>

  <Footer
      user-name="Lucas Genoud"
      github-link="https://github.com/LucasGenoud/"
      linkedin-link="https://www.linkedin.com/in/lucas-genoud/"
      :background-theme="backgroundTheme"
  />
</template>

<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Footer from './Footer.vue'; // Import the Footer component

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
let scene = null;
let controls = null;
const numberOfPoints = ref(1000000);
const minNumberOfPoints = 1;
const maxNumberOfPoints = 5000000;
let loading = ref(true);
const shapeType = ref("sierpinskiTriangle");
const backgroundTheme = ref("dark");
const worker = new Worker(new URL('../worker.js', import.meta.url));

function drawShape() {
  worker.postMessage({
    numberOfPoints: numberOfPoints.value,
    is3D: shapeType.value === "sierpinskiPyramid"
  });

  worker.onmessage = function (event) {
    const {points, colors} = event.data;

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.00001,
      vertexColors: true,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    animate();
    loading.value = false;
  };

  worker.onerror = function (error) {
    console.error('Worker error: ', error);
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function resetScene() {
  scene.remove(...scene.children);
  loading.value = true;
  drawShape();
}

function updateBackground() {
  const canvasElement = document.getElementById("canvas");
  // Remove all theme classes
  canvasElement.classList.remove('dark-bg', 'white-bg');
  // Add the current theme class
  canvasElement.classList.add(`${backgroundTheme.value}-bg`);
}

// Watch for background theme changes
watch(backgroundTheme, () => {
  updateBackground();
});


onMounted(() => {
  scene = new THREE.Scene();
  document.getElementById("canvas").appendChild(renderer.domElement);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;

  updateBackground();
  resetScene();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  worker.terminate();
});
</script>
<style scoped>
/* Styles for the main component */
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background-color 0.3s ease;
}

.dark-bg {
  background-color: #000000;
}

.white-bg {
  background-color: #ffffff;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.5rem;
}

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
  width: 120px;
  text-align: right;
  font-size: 14px;
}

.control-number-of-points {
  margin-left: 15px;
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

.slider {
  width: 150px;
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
}
</style>