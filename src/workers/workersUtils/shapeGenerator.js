self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');


function getPolygonVerticesList(numberOfSides, size, centerX, centerY) {
    const vertices = [];
    const angleStep = (2 * Math.PI) / numberOfSides;

    for (let i = 0; i < numberOfSides; i++) {
        const angle = i * angleStep;
        const x = centerX + size * Math.cos(angle);
        const y = centerY + size * Math.sin(angle);
        vertices.push(new THREE.Vector3(x, y, 0));
    }
    return vertices;
}
const shapeGenerator = {

    // Triangle (2D)
    triangle: (size, centerX, centerY, height) => {
        let baseHeight = (Math.sqrt(3) / 2) * size;
        let A = new THREE.Vector3(centerX, centerY + baseHeight / 2, 0);
        let B = new THREE.Vector3(centerX - size / 2, centerY - baseHeight / 2, 0);
        let C = new THREE.Vector3(centerX + size / 2, centerY - baseHeight / 2, 0);
        return [A, B, C];
    },

    // Tetrahedron (3D)
    tetrahedron: (size, centerX, centerY, height) => {
        let baseHeight = (Math.sqrt(3) / 2) * size;
        let A = new THREE.Vector3(centerX, centerY + baseHeight / 2, 0);
        let B = new THREE.Vector3(centerX - size / 2, centerY - baseHeight / 2, 0);
        let C = new THREE.Vector3(centerX + size / 2, centerY - baseHeight / 2, 0);
        let D = new THREE.Vector3(centerX, centerY, height);
        return [A, B, C, D];
    },

    // Square (2D)
    square: (size, centerX, centerY, height) => {
        let halfSize = size / 2;
        let A = new THREE.Vector3(centerX - halfSize, centerY - halfSize, 0);
        let B = new THREE.Vector3(centerX + halfSize, centerY - halfSize, 0);
        let C = new THREE.Vector3(centerX + halfSize, centerY + halfSize, 0);
        let D = new THREE.Vector3(centerX - halfSize, centerY + halfSize, 0);
        return [A, B, C, D];
    },

    // Cube (3D)
    cube: (size, centerX, centerY, height) => {
        let halfSize = size / 2;
        let A = new THREE.Vector3(centerX - halfSize, centerY - halfSize, -halfSize);
        let B = new THREE.Vector3(centerX + halfSize, centerY - halfSize, -halfSize);
        let C = new THREE.Vector3(centerX + halfSize, centerY + halfSize, -halfSize);
        let D = new THREE.Vector3(centerX - halfSize, centerY + halfSize, -halfSize);
        let E = new THREE.Vector3(centerX - halfSize, centerY - halfSize, halfSize);
        let F = new THREE.Vector3(centerX + halfSize, centerY - halfSize, halfSize);
        let G = new THREE.Vector3(centerX + halfSize, centerY + halfSize, halfSize);
        let H = new THREE.Vector3(centerX - halfSize, centerY + halfSize, halfSize);
        return [A, B, C, D, E, F, G, H];
    },

    // Pentagon (2D)
    pentagon: (size, centerX, centerY, height) => {
        return getPolygonVerticesList(5, size, centerX, centerY);

    },
    pentagon_r0_5: (size, centerX, centerY, height) => {
        return getPolygonVerticesList(5, size, centerX, centerY);

    },
    // Hexagon (2D)
    hexagon: (size, centerX, centerY, height) => {
        return getPolygonVerticesList(6, size, centerX, centerY);
    },
    // Hexagon (2D)
    heptagon_r1_4 : (size, centerX, centerY, height) => {
        return getPolygonVerticesList(7, size, centerX, centerY);
    },
    heptagon_r2 : (size, centerX, centerY, height) => {
        return getPolygonVerticesList(7, size, centerX, centerY);
    },

};
self.shapeGenerators = shapeGenerator;