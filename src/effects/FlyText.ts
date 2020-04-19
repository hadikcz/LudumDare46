import Phaser from 'phaser';
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
import {Depths} from "enums/Depths";
import EffectManager from "effects/EffectManager";

export default class FlyText extends Phaser.GameObjects.Text {
    constructor (scene) {
        super(scene, EffectManager.DEFAULT_POSITION[0], EffectManager.DEFAULT_POSITION[1], '', {
            fontFamily: 'AldotheApache, Verdana, Arial',
            fontSize: 64,
            color: '#0000FF'
        } as unknown as TextStyle);

        this.setScale(.5);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.setStroke('#FFFFFF', 8);

        this.setDepth(Depths.FLY_TEXT);
        this.setActive(false);
        this.setVisible(false);
    }


    launch (x: number, y: number, text: string, style: object | any): void {
        this.setText(text);
        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
        this.setAlpha(1);

        if (style !== undefined) {
            this.setStyle(style);
        }

        let range = 20;
        let tweenX = Phaser.Math.RND.realInRange(-range, range);
        let tweenY = -250;
        let duration = Phaser.Math.RND.integerInRange(3000, 4000);

        this.scene.tweens.add({
            targets: this,
            x: this.x + tweenX,
            y: this.y + tweenY,
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
