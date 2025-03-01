// colorFunctions.js
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');

function getRandomVertice(vertices) {
    return vertices[Math.floor(Math.random() * vertices.length)];
}
function getRandomVerticeWithPrevious(vertices, previousVertice) {
    let randomVertice = getRandomVertice(vertices);
    while (randomVertice === previousVertice) {
        randomVertice = getRandomVertice(vertices);
    }
    return randomVertice;
}
// Color functions
const randomFunctions = {
    // Triangle (2D)
    triangle: (vertices) => {
        return getRandomVertice(vertices);
    },

    // Tetrahedron (3D)
    tetrahedron: (vertices) => {
        return getRandomVertice(vertices);

    },

    // Square (2D)
    square: (vertices, previousVertices) => {
        return getRandomVerticeWithPrevious(vertices, previousVertices);

    },

    // Cube (3D)
    cube: (vertices) => {
        return getRandomVertice(vertices);

    },

    // Pentagon (2D)
    pentagon: (vertices) => {
        return getRandomVertice(vertices);

    },

    // Hexagon (2D)
    hexagon: (vertices) => {
        return getRandomVertice(vertices);

    }
};

// Export for web worker context
self.randomFunctions = randomFunctions;