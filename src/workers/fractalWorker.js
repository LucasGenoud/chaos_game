self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
self.importScripts('shapeGenerator.js');
self.importScripts('colorFunctions.js');
self.importScripts('randomFunctions.js');

function generateChaosGame(options) {
    const {
        shapeType = 'triangle',
        size = 50,
        centerX = 0,
        centerY = 0,
        height = 50,
        numberOfPoints = 1000000,
        colorMode = 'hsl',
        jumpRatio = 0.5
    } = options;

    const getVerticesFunc = self.shapeGenerators[shapeType];
    const vertices = getVerticesFunc(size, centerX, centerY, height);

    const colorFunc = self.colorFunctions[colorMode];

    const center = new THREE.Vector3();
    vertices.forEach(vertex => center.add(vertex));
    center.divideScalar(vertices.length);

    let previousPoint = center.clone();
    let previousVertex;
    const points = [];
    const colors = [];

    const vertexColors = vertices.map((vertex, index) => {
        const hue = index / vertices.length;
        return new THREE.Color().setHSL(hue, 1.0, 0.5);
    });

    for (let i = 0; i < numberOfPoints; i++) {
        const randomFunction = self.randomFunctions[shapeType];

        const randomVertex = randomFunction(vertices, previousVertex);
        const vertexIndex = vertices.indexOf(randomVertex);
        previousVertex = randomVertex;

        const newPoint = new THREE.Vector3();
        newPoint.x = previousPoint.x + (randomVertex.x - previousPoint.x) * jumpRatio;
        newPoint.y = previousPoint.y + (randomVertex.y - previousPoint.y) * jumpRatio;
        newPoint.z = previousPoint.z + (randomVertex.z - previousPoint.z) * jumpRatio;

        points.push(newPoint);

        const vertexColor = vertexColors[vertexIndex];
        colors.push(vertexColor.r, vertexColor.g, vertexColor.b);

        previousPoint.copy(newPoint);
    }

    return { points, colors };
}

self.onmessage = function(event) {
    const options = event.data;
    const result = generateChaosGame(options);
    self.postMessage(result);
};