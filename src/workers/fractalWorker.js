self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
self.importScripts('./workersUtils/shapeGenerator.js');
self.importScripts('./workersUtils/colorFunctions.js');
self.importScripts('./workersUtils/randomFunctions.js');

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


    const center = new THREE.Vector3();
    vertices.forEach(vertex => center.add(vertex));
    center.divideScalar(vertices.length);

    let previousPoint = { x: center.x, y: center.y, z: center.z };
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

        const newX = previousPoint.x + (randomVertex.x - previousPoint.x) * jumpRatio;
        const newY = previousPoint.y + (randomVertex.y - previousPoint.y) * jumpRatio;
        const newZ = previousPoint.z + (randomVertex.z - previousPoint.z) * jumpRatio;

        points.push(newX, newY, newZ);

        const vertexColor = vertexColors[vertexIndex];
        colors.push(vertexColor.r, vertexColor.g, vertexColor.b);

        previousPoint =  { x: newX, y: newY, z: newZ };
        if (i % 1000 === 0) {
            self.postMessage({type: "progress", progress: Math.round((i / numberOfPoints) * 100)});
        }
    }

    return { points, colors };
}

self.onmessage = function(event) {
    const options = event.data;
    const {points, colors} = generateChaosGame(options);
    self.postMessage({type: "results", points, colors});
};