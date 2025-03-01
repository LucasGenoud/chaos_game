self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');

function getPentagonVertices(size, centerX, centerY) {
    const vertices = [];
    const angleOffset = Math.PI / 2; // Rotate the pentagon so that one vertex points upwards
    for (let i = 0; i < 5; i++) {
        const angle = angleOffset + (i * 2 * Math.PI) / 5;
        const x = centerX + size * Math.cos(angle);
        const y = centerY + size * Math.sin(angle);
        vertices.push(new THREE.Vector3(x, y, 0));
    }
    return vertices;
}

self.onmessage = function (event) {
    const { numberOfPoints } = event.data;

    const vertices = getPentagonVertices(50, 0, 0);
    const center = new THREE.Vector3();
    vertices.forEach(vertex => center.add(vertex));
    center.divideScalar(vertices.length);

    let previousPoint = center.clone();
    const points = [];
    const colors = [];

    for (let i = 0; i < numberOfPoints; i++) {
        const randomVertex = vertices[Math.floor(Math.random() * vertices.length)];
        const center_x = previousPoint.x + (randomVertex.x - previousPoint.x)  * 5 / 8;
        const center_y = previousPoint.y + (randomVertex.y - previousPoint.y)  * 5 / 8;
        const center_z = 0;
        const point = new THREE.Vector3(center_x, center_y, center_z);
        points.push(point);

        const distance = point.distanceTo(center);
        const maxDistance = center.distanceTo(vertices[0]);
        const normalizedDistance = distance / maxDistance;

        const color = new THREE.Color();
        color.setHSL(0.7 - normalizedDistance * 0.7, 1.0, 0.5);
        colors.push(color.r, color.g, color.b);

        previousPoint.copy(point);
    }

    self.postMessage({ points, colors });
};