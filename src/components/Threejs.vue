<template>
  <Controls>  </Controls>
  <div class="canvas" id="canvas"></div>
  <div v-if="loading" class="loading">LOADING</div>

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
const fractalWorker = new Worker(new URL('../workers/fractalWorker.js', import.meta.url));
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
let scene = null;
let controls = null;

const controlsStore = useControlsStore()
const { numberOfPoints, fractalType, backgroundTheme, fractalColor, resetCamera } = storeToRefs(controlsStore)

let loading = ref(true);

const initialCameraPosition = { x: 0, y: 0, z: 100 };
const initialCameraTarget = {x: 0, y: 0, z: 0};

let worker;
const jumpRatios = {
  triangle: 0.5,
  tetrahedron: 0.5,
  pentagon: 2 / 3,
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
  controls.zoomToCursor = true;
  renderer.render(scene, camera);
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

// Function to reset camera to initial position
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
</style>