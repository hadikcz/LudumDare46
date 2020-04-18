import Phaser from 'phaser';
import GameScene from "scenes/GameScene";

export default class PlayerCharacter extends Phaser.GameObjects.Container implements Phaser.GameObjects.GameObject {

    public scene!: GameScene;
    private static readonly SCALE: number = 3;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setScale(PlayerCharacter.SCALE);

        this.scene.anims.create({
            key: 'playerCharacterWalk',
            frames: this.scene.anims.generateFrameNumbers('characters', { start: 0, end: 3, first: 0 }),
            frameRate: 8,
            repeat: -1
        });

        let image = this.scene.add.sprite(0, 0, 'characters', 0);
        this.add(image);

        image.anims.play('playerCharacterWalk');

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.scene.physics.moveTo(this, pointer.worldX, pointer.worldY, 150);

        });
    }

    preUpdate (): void {
        let body = this.body as Phaser.Physics.Arcade.Body;
        if (body.velocity.x < 0) {
            this.setScale(-PlayerCharacter.SCALE, PlayerCharacter.SCALE);
        } else if (body.velocity.x > 0) {
            this.setScale(PlayerCharacter.SCALE, PlayerCharacter.SCALE);
        }
    }
}
