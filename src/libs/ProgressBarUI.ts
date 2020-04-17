export default class ProgressBarUI extends Phaser.GameObjects.Container {

    protected scene: Phaser.Scene;
    private config: any | object;
    private bgImage!: Phaser.GameObjects.Image;
    private barImage!: Phaser.GameObjects.Image;
    private followTarget: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite | Phaser.GameObjects.Container;
    private text!: Phaser.GameObjects.Text;

    constructor (scene: Phaser.Scene, config: any) {
        if (config.x === undefined) config.x = 0;
        if (config.y === undefined) config.y = 0;
        super(scene, config.x, config.y, []);

        this.scene = scene;
        this.config = config;
        this.setDefaultValues();

        this.followTarget = config.followTarget ? config.followTarget : null;

        this.scene.add.existing(this);
        this.checkDefaultConfigValues();

        this.drawBackground();
        this.drawBar();

        if (this.config.drawText) {
            this.text = this.scene.add.text(this.config.textConfig.textPosX || 0, this.config.textConfig.textPosY || 0, this.config.textConfig.textDefault || '', this.config.textConfig || { fill: '#FF0000' });
            if (this.config.textConfig.fontStyle !== undefined) {
                this.text.setFontStyle(this.config.textConfig.fontStyle);
            }
            if (this.config.textConfig.strokeColor !== undefined && this.config.textConfig.strokeSize !== undefined) {
                this.text.setStroke(this.config.textConfig.strokeColor, this.config.textConfig.strokeSize);
            }
            this.add(this.text);
        }
        this.setDepth(this.config.depth);
    }

    preUpdate (): void {
        if (this.followTarget) {
            this.setPosition(
                this.followTarget.x + this.config.offsetX,
                this.followTarget.y + this.config.offsetY
            );
        }
    }

    destroy (): void {
        this.bgImage.destroy();
        this.barImage.destroy();
    }

    hide (): void {
        this.bgImage.setVisible(false);
        this.bgImage.setActive(false);
        this.barImage.setVisible(false);
        this.barImage.setActive(false);
    }

    show (): void {
        this.bgImage.setVisible(true);
        this.bgImage.setActive(true);
        this.barImage.setVisible(true);
        this.barImage.setActive(true);
    }

    setFrames (bg: string, bar: string): void {
        this.bgImage.setFrame(bg);
        this.barImage.setFrame(bar);
    }

    setOffsetX (x: number): void {
        this.config.offsetX = x;
    }

    setOffsetY (y: number): void {
        this.config.offsetY = y;
    }

    setFixedToCamera (fixed: boolean = true): void {
        let scrollFactor = fixed ? 0 : 1;
        this.bgImage.setScrollFactor(scrollFactor);
        this.barImage.setScrollFactor(scrollFactor);
    }

    setPercent (percent: number, delay: number | null = null): void {
        if (percent < 0) {
            percent = 0;
        }
        let newScale = {
            x: percent / 100,
            y: 1
        };

        if (delay) {
            this.scene.add.tween({
                targets: this.barImage,
                scaleX: newScale.x,
                scaleY: newScale.y,
                delay: delay,
                ease: 'linear'
            });
        } else {
            this.barImage.setScale(newScale.x, newScale.y);
        }

        if (this.text && this.config.textPercent) {
            this.text.setText(percent + '%');
        }
    }

    setText (text: string): void {
        if (this.text) {
            this.text.setText(text);
        }
    }

    private checkDefaultConfigValues (): void {
        if (this.config.barOffsetX === undefined) {
            this.config.barOffsetX = 0;
        }

        if (this.config.barOffsetY === undefined) {
            this.config.barOffsetY = 0;
        }

        if (this.config.drawText === undefined) {
            this.config.drawText = false;
        }

        if (this.config.offsetX === undefined) {
            this.config.offsetX = 0;
        }

        if (this.config.offsetY === undefined) {
            this.config.offsetY = 0;
        }
    }

    private drawBackground (): void {
        if (this.config.bgTexture !== undefined) {
            this.bgImage = this.scene.add.image(this.config.bgX, this.config.bgY, this.config.bgTexture);
        } else if (this.config.spriteSheet !== undefined) {
            this.bgImage = this.scene.add.image(this.config.bgX, this.config.bgY, this.config.spriteSheet, 1);
        } else if (this.config.atlas !== undefined) {
            this.bgImage = this.scene.add.image(this.config.bgX, this.config.bgY, this.config.atlas, this.config.atlasBg ? this.config.atlasBg : 'bg');
        } else {
            throw 'No bg texture given';
        }
        this.bgImage.setOrigin(0);
        this.add(this.bgImage);
    }

    private drawBar (): void {
        if (this.config.barTexture !== undefined) {
            this.barImage = this.scene.add.image(this.config.barX, this.config.barY, this.config.barTexture);
        } else if (this.config.spriteSheet !== undefined) {
            this.barImage = this.scene.add.image(this.config.barX, this.config.barY, this.config.spriteSheet, 0);
        } else if (this.config.atlas !== undefined) {
            this.barImage = this.scene.add.image(this.config.barX, this.config.barY, this.config.atlas, this.config.atlasBar ? this.config.atlasBar : 'bar');
        } else {
            throw 'No bar texture given';
        }
        if (this.config.barAlpha !== undefined) {
            this.barImage.setAlpha(this.config.barAlpha);
        }
        this.barImage.setOrigin(0);
        this.add(this.barImage);
    }

    private setDefaultValues(): void {
        if (this.config.barX === undefined)
            this.config.barX = 0;
        if (this.config.barY === undefined)
            this.config.bary = 0;

        if (this.config.bgX === undefined)
            this.config.bgX = 0;
        if (this.config.bgY === undefined)
            this.config.bgy = 0;

        if (this.config.textPercent === undefined)
            this.config.textPercent = false;
    }
}
