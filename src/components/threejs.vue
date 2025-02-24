<script setup>
import * as THREE from "three";
import {onMounted, onUnmounted, ref} from 'vue';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
let scene = null;
let controls = null;
const numberOfPoints = 1000000;
let loading = ref(true);
const worker = new Worker(new URL('../worker.js', import.meta.url));

function drawPyramid(vertices) {
  worker.postMessage({vertices, numberOfPoints});

}
worker.onerror = function (error) {
  console.error('Worker error: ', error);
};
worker.onmessage = function (event) {
  console.log("Finished loading points");
  const {points, colors} = event.data;

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: true,
  });

  const pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
  animate();
  loading.value = false;

};
function getPyramidVertices(size, centerX, centerY, height) {
  let baseHeight = (Math.sqrt(3) / 2) * size;
  let A = new THREE.Vector3(centerX, centerY + baseHeight / 2, 0);
  let B = new THREE.Vector3(centerX - size / 2, centerY - baseHeight / 2, 0);
  let C = new THREE.Vector3(centerX + size / 2, centerY - baseHeight / 2, 0);
  let D = new THREE.Vector3(centerX, centerY, height);
  return [A, B, C, D];
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

onMounted(() => {
  scene = new THREE.Scene();

  document.getElementById("canvas").appendChild(renderer.domElement);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;

  const vertices = getPyramidVertices(50, 0, 0, 50);

  drawPyramid(vertices);
  renderer.render(scene, camera);

  window.addEventListener('resize', onWindowResize);


});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  worker.terminate();
});
</script>

<template>

  <div class="canvas" id="canvas"></div>
<div v-if="loading" class="loading">LOADING</div>
</template>

<style scoped>
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
}
</style>