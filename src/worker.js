self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');

self.onmessage = function (event) {
    const { vertices, numberOfPoints } = event.data;
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
        const randomVertex = vertices[Math.floor(Math.random() * vertices.length)];
        const x = (randomVertex.x + previousPoint.x) / 2;
        const y = (randomVertex.y + previousPoint.y) / 2;
        const z = (randomVertex.z + previousPoint.z) / 2;
        const point = new THREE.Vector3(x, y, z);
        points.push(point);

        const distance = point.distanceTo(center);
        const maxDistance = center.distanceTo(D);
        const normalizedDistance = distance / maxDistance;

        const color = new THREE.Color();
        color.setHSL(0.7 - normalizedDistance * 0.7, 1.0, 0.5);
        colors.push(color.r, color.g, color.b);

        previousPoint.copy(point);
    }
    self.postMessage({ points, colors });
};