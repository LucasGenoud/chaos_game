<script setup>
import * as THREE from 'three';
import { onMounted, onUnmounted } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
let scene = null;
let controls = null;
const numberOfPoints = 1000000;

function getPoints(vertices){
  const [A, B, C, D] = vertices;

  const center = new THREE.Vector3(
      (A.x + B.x + C.x + D.x) / 4,
      (A.y + B.y + C.y + D.y) / 4,
      (A.z + B.z + C.z + D.z) / 4
  );

  let previousPoint = center.clone();
  const points = [];
  const colors = [];

  for (let i = 0; i < numberOfPoints; i++) {

    const randomVertex = vertices[Math.floor(Math.random() * 4)];
    const x = (randomVertex.x + previousPoint.x) / 2;
    const y = (randomVertex.y + previousPoint.y) / 2;
    const z = (randomVertex.z + previousPoint.z) / 2;
    const point = new THREE.Vector3(x, y, z);
    points.push(point);

    const distance = point.distanceTo(center);
    const maxDistance = center.distanceTo(D); // Distance from center to apex
    const normalizedDistance = distance / maxDistance;

    const color = new THREE.Color();
    color.setHSL(0.7 - normalizedDistance * 0.7, 1.0, 0.5); // Blue to red gradient
    colors.push(color.r, color.g, color.b);

    previousPoint.copy(point);
  }
  return { points, colors };
}
function drawPyramid(vertices) {

  const { points, colors } = getPoints(vertices);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); // Add color attribute

  const material = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: true,

  });

  const pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

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

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});
onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
});
</script>

<template>
  <div class="canvas" id="canvas"></div>
</template>

<style scoped>
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>