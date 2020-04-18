import 'phaser';

declare let window: any;

export default class BootScene extends Phaser.Scene {
    constructor () {
        super({ key: 'BootScene', plugins: ['Loader'] });
    }

    preload (): void {
        window.bootScene = this;
        this.sys.scale.refresh();

        const progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height as number / 2, this.sys.game.config.width as number * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
            this.startGame();
        }, this);

        // LOAD assets HERE
        this.load.atlas('assets', 'assets/images/assets.png', 'assets/images/assets.json');
        this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 36, frameHeight: 36, endFrame: 40 });
        this.load.image('mobPlaceholder', 'assets/images/mobPlaceholder.png');
    }

    private startGame (): void {
        this.scene.start('GameScene', {});
    }
}
