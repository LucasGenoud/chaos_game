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
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
let scene = null;
let controls = null;

const controlsStore = useControlsStore()
const { numberOfPoints, fractalType, backgroundTheme } = storeToRefs(controlsStore)
const workersLocation = {
  sierpinskiTriangle: '../workers/sierpinskiTriangleWorker.js',
  sierpinskiPyramid: '../workers/sierpinskiPyramidWorker.js',
};
let loading = ref(true);

let worker;

function drawShape() {
  if (worker !== undefined) worker.terminate();

  worker = new Worker(new URL(workersLocation[fractalType.value], import.meta.url));
  worker.postMessage({
    numberOfPoints: numberOfPoints.value,
    is3D: fractalType.value === "sierpinskiPyramid"
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

watch(backgroundTheme, () => {
  updateBackground();
});

watch([numberOfPoints, fractalType], () => {
  reloadScene();
});
onMounted(() => {
  scene = new THREE.Scene();
  document.getElementById("canvas").appendChild(renderer.domElement);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;

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