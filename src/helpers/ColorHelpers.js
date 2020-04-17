import Phaser from 'phaser';

export default class ColorHelpers {
    /**
     * @param {number} saturate - 0 to 100 percent
     * @param {number} bright - 0 to 100 percent
     * @return {number}
     */
    static randomTint (saturate = 40, bright = 0) {
        let color = new Phaser.Display.Color();
        color.random();
        color.saturate(saturate);
        color.brighten(bright);
        return color.color;
    }
}
