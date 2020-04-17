export default class PolygonHelpers {
    /**
     * Client ONLY!
     * @param {Phaser.Scene} scene
     * @param {Phaser.Geom.Polygon} polygon
     * @param {string} color
     * @param {boolean} closePath
     * @returns {Phaser.GameObjects.Graphics}
     */
    static drawPolygon (scene, polygon, color, closePath) {
        if (closePath === undefined) {
            closePath = true;
        }
        if (color === undefined) {
            color = 0x00FF00;
        }
        var graphics = scene.add.graphics({ x: 0, y: 0 });
        graphics.lineStyle(3, color);
        graphics.beginPath();

        for (let i = 0; i < polygon.points.length; i++) {
            graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
        }
        if (closePath) {
            graphics.closePath();
        }
        graphics.strokePath();
        return graphics;
    }
}
