import Phaser from 'phaser';

export default class WinScene extends Phaser.Scene {
    constructor () {
        super({ key: 'WinScene' });
    }

    create () {
        let texts = [
            'After hard work',
            'you finally got employ',
            'who will do hard work instead you.'
        ];

        let timeBetweenText = 5500;
        let i = 0;
        texts.forEach((text) => {
            setTimeout(() => {
                this.showText(text);
            }, i * timeBetweenText);
            i++;
        });

        setTimeout(() => {
            let texts2 = [
                'The End'
            ];
            this.showText(texts2, true);
        }, i * timeBetweenText);
    }

    showText (text, last = false) {
        let textObject = this.add.text(this.physics.world.bounds.centerX, this.physics.world.bounds.centerY, text, { fill: '#FFF', fontFamily: 'arcadeclassic', fontSize: 50, align: 'center' }).setOrigin(0.5, 0.5).setAlpha(0);
        this.add.tween({
            targets: textObject,
            duration: 1000,
            alpha: 1,
            onComplete: () => {
                if (!last) {
                    setTimeout(() => {
                        this.add.tween({
                            targets: textObject,
                            duration: 1000,
                            alpha: 0
                        });
                    }, 3000);
                }
            }
        });
    }
}
