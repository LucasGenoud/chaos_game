self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');

function getRandomVertices(vertices) {
    return vertices[Math.floor(Math.random() * vertices.length)];
}
function getRandomVerticeWithPrevious(vertices, previousVertice) {
    let randomVertices = getRandomVertices(vertices);
    while (randomVertices === previousVertice) {
        randomVertices = getRandomVertices(vertices);
    }
    return randomVertices;
}
const randomFunctions = {
    // Triangle (2D)
    triangle: (vertices) => {
        return getRandomVertices(vertices);
    },

    // Tetrahedron (3D)
    tetrahedron: (vertices) => {
        return getRandomVertices(vertices);

    },

    // Square (2D)
    square: (vertices, previousVertices) => {
        return getRandomVerticeWithPrevious(vertices, previousVertices);

    },

    // Cube (3D)
    cube: (vertices) => {
        return getRandomVertices(vertices);

    },

    // Pentagon (2D)
    pentagon: (vertices) => {
        return getRandomVertices(vertices);

    },

    // Hexagon (2D)
    hexagon: (vertices) => {
        return getRandomVertices(vertices);

    }
};

// Export for web worker context
self.randomFunctions = randomFunctions;