<template>
  <Controls>  </Controls>
  <div class="canvas" id="canvas"></div>
  <div v-if="loading" class="loading">LOADING {{progress}}%</div>
  <div class="fps-counter">{{ fps }} FPS</div>

  <Footer
      user-name="Lucas Genoud"
      github-link="https://github.com/LucasGenoud/"
      linkedin-link="https://www.linkedin.com/in/lucas-genoud/"
      :background-theme="backgroundTheme"
  />
</template>

<script setup>
import * as THREE from "three";
import {useControlsStore} from "@/stores/controls.js";
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Footer from './Footer.vue';
import Controls from './Controls.vue';
import {storeToRefs} from "pinia";
import {InstancedMesh} from "three";
const fractalWorker = new Worker(new URL('../workers/fractalWorker.js', import.meta.url));
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
let scene = null;
let controls = null;
let progress = ref(0);
const controlsStore = useControlsStore()
const { numberOfPoints, fractalType, backgroundTheme, fractalColor, resetCamera } = storeToRefs(controlsStore)

let loading = ref(true);
let fps = ref(0);
let frameCount = 0;
let lastTime = performance.now();

const initialCameraPosition = { x: 0, y: 0, z: 100 };
const initialCameraTarget = {x: 0, y: 0, z: 0};

let worker;
const jumpRatios = {
  triangle: 0.5,
  tetrahedron: 0.5,
  pentagon: 2 / 3,
  pentagon_r0_5: 0.5,
  hexagon: 2 / 3,
  heptagon_r1_4: 1.4,
  heptagon_r2: 2,
};

function drawShape() {
  worker = fractalWorker
  worker.postMessage({
    shapeType: fractalType.value,
    numberOfPoints: numberOfPoints.value,
    colorMode: fractalColor.value,
    jumpRatio: jumpRatios[fractalType.value],
  });

  worker.onmessage = function (event) {
    if (event.data.type === 'results') {
      displayDots(event.data.points, event.data.colors);
    } else if (event.data.type === "progress"){
      progress.value = event.data.progress;
    }

  };

  worker.onerror = function (error) {
    console.error('Worker error: ', error);
  };
}
function displayDots(points, colors){

  const geometry = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(points, 3)
  );
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();

  const material = new THREE.PointsMaterial({
    size: 0.0001,
    vertexColors: true,
  });

  let p = new THREE.Points(geometry, material);

  scene.add(p);
  animate();
  loading.value = false;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function calculateFPS() {
  frameCount++;
  const currentTime = performance.now();
  const elapsed = currentTime - lastTime;

  if (elapsed >= 1000) {
    fps.value = Math.round((frameCount * 1000) / elapsed);
    frameCount = 0;
    lastTime = currentTime;
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  controls.zoomToCursor = true;
  renderer.render(scene, camera);
  calculateFPS();
}

function reloadScene() {
  scene.remove(...scene.children);
  loading.value = true;
  drawShape();
}

function updateBackground() {
  const canvasElement = document.getElementById("canvas");
  canvasElement.classList.remove('dark-bg', 'white-bg');
  canvasElement.classList.add(`${backgroundTheme.value}-bg`);
}

function resetCameraPosition() {
  camera.position.set(
      initialCameraPosition.x,
      initialCameraPosition.y,
      initialCameraPosition.z
  );
  controls.target.set(
      initialCameraTarget.x,
      initialCameraTarget.y,
      initialCameraTarget.z
  );
  controls.update();
}

watch(backgroundTheme, () => {
  updateBackground();
});

watch([numberOfPoints, fractalType, fractalColor], () => {
  reloadScene();
});

watch(resetCamera, () => {
  resetCameraPosition();
});

onMounted(() => {
  scene = new THREE.Scene();
  document.getElementById("canvas").appendChild(renderer.domElement);
  camera.position.set(
      initialCameraPosition.x,
      initialCameraPosition.y,
      initialCameraPosition.z
  );
  camera.lookAt(
      initialCameraTarget.x,
      initialCameraTarget.y,
      initialCameraTarget.z
  );

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.zoomSpeed = 1.0;
  controls.minDistance = 0.1;
  controls.maxDistance = Infinity;

  updateBackground();
  reloadScene();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  worker.terminate();
});
</script>
<style scoped>
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background-color 0.3s ease;
}

.dark-bg {
  background-color: #0B090A;
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

.fps-counter {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  z-index: 100;
}
</style>