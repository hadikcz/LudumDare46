import Phaser from 'phaser';
import {Depths} from "enums/Depths";
import EffectManager from "effects/EffectManager";

export default class PermaDeaths extends Phaser.GameObjects.Image {
    constructor (scene) {
        super(scene, EffectManager.DEFAULT_POSITION[0], EffectManager.DEFAULT_POSITION[1], 'assets', 'game_skull_permanent');

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.setDepth(Depths.UI_ICONS);
        this.setActive(false);
        this.setVisible(false);
        this.setScale(0.85);
    }


    launch (x: number, y: number, y2Add: number): void {
        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
        this.setAlpha(1);
        let duration = Phaser.Math.RND.integerInRange(6000, 10000);

        this.scene.tweens.add({
            targets: this,
            y: y + y2Add,
            alpha: 0,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.setActive(false);
                this.setVisible(false);
            }
        });
    }
}
