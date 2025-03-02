import {defineStore} from "pinia";

export const useControlsStore = defineStore('counter', {
    state: () => ({  numberOfPoints: 1000000, fractalType: "triangle", fractalColor:"hsl",  "backgroundTheme": "dark", resetCamera: false}),

    actions: {
        setNumberOfPoints(numberOfPoints) {
            this.numberOfPoints = numberOfPoints;
        },
        setFractalType(fractalType) {
            this.fractalType = fractalType;
        },
        setBackgroundTheme(backgroundTheme) {
            this.backgroundTheme = backgroundTheme;
        },
        setFractalColor(fractalColor) {
            this.fractalColor = fractalColor;
        },
    },
})