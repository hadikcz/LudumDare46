import Phaser from 'phaser';

export default class CameraHelpers {
    /**
     * @param {number} defaultWidth
     * @param {number} defaultHeight
     * @returns {number}
     */
    static calcBaseZoom (defaultWidth, defaultHeight) {
        let baseWidth = defaultWidth;
        let baseHeight = defaultHeight;

        let diffWidth = window.innerWidth / baseWidth;
        let diffHeight = window.innerHeight / baseHeight;

        return (diffWidth + diffHeight) / 2;
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    static isNearCamera (scene, x, y) {
        let cameraPoint = scene.cameras.main.midPoint;
        return Phaser.Math.Distance.Between(cameraPoint.x, cameraPoint.y, x, y) <= scene.cameras.main.displayHeight;
    }
}
