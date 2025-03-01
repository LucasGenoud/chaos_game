self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');

const colorFunctions = {
    hsl: (normalizedDistance) => {
        const color = new THREE.Color();
        color.setHSL(0.7 - normalizedDistance * 0.7, 1.0, 0.5);
        return color;
    },

    rgb: (normalizedDistance) => {
        const color = new THREE.Color();
        color.r = 1 - normalizedDistance;
        color.g = normalizedDistance * 0.5;
        color.b = normalizedDistance;
        return color;
    },

    rainbow: (normalizedDistance) => {
        const color = new THREE.Color();
        color.setHSL(normalizedDistance, 0.8, 0.5);
        return color;
    },

    fire: (normalizedDistance) => {
        const color = new THREE.Color();
        const hue = 0.05 + normalizedDistance * 0.15; // Red to yellow
        const saturation = 1.0;
        const lightness = 0.3 + normalizedDistance * 0.4;
        color.setHSL(hue, saturation, lightness);
        return color;
    }
};

// Export for web worker context
self.colorFunctions = colorFunctions;