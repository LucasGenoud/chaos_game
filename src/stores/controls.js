import {defineStore} from "pinia";

export const useControlsStore = defineStore('counter', {
    state: () => ({  numberOfPoints: 1000000, fractalType: "sierpinskiTriangle", "backgroundTheme": "dark" }),

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
    },
})