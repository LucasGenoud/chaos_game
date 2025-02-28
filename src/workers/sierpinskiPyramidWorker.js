
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
function getVertices(size, centerX, centerY, height) {
    let baseHeight = (Math.sqrt(3) / 2) * size;
    let A = new THREE.Vector3(centerX, centerY + baseHeight / 2, 0);
    let B = new THREE.Vector3(centerX - size / 2, centerY - baseHeight / 2, 0);
    let C = new THREE.Vector3(centerX + size / 2, centerY - baseHeight / 2, 0);
    let D = new THREE.Vector3(centerX, centerY, height);
    return [A, B, C, D];
}


self.onmessage = function (event) {
    const { numberOfPoints, is3D } = event.data;

    const vertices = getVertices(50, 0, 0, 50)
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
        const center_x = (randomVertex.x + previousPoint.x) / 2;
        const center_y = (randomVertex.y + previousPoint.y) / 2;
        const center_z = (randomVertex.z + previousPoint.z) / 2;
        const point = new THREE.Vector3(center_x, center_y, center_z);
        points.push(point);

        const distance = point.distanceTo(center);
        const maxDistance = center.distanceTo(vertices[3])
        const normalizedDistance = distance / maxDistance;

        const color = new THREE.Color();
        color.setHSL(0.7 - normalizedDistance * 0.7, 1.0, 0.5);
        colors.push(color.r, color.g, color.b);

        previousPoint.copy(point);
    }


    self.postMessage({ points, colors });
};