import Phaser from 'phaser';
import GameScene from "scenes/GameScene";
import Vector2 = Phaser.Math.Vector2;

export default class PlayerCharacter extends Phaser.GameObjects.Container implements Phaser.GameObjects.GameObject {

    public scene!: GameScene;
    private static readonly SCALE: number = 3;
    private character: Phaser.GameObjects.Sprite;
    private positionToMove: Vector2 | null = null;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        let body = this.body as Phaser.Physics.Arcade.Body;

        body.setFriction(100, 100);
        this.setScale(PlayerCharacter.SCALE);

        this.scene.anims.create({
            key: 'playerCharacterWalk',
            frames: this.scene.anims.generateFrameNumbers('characters', { start: 0, end: 3, first: 0 }),
            frameRate: 8,
            repeat: -1
        });

        this.character = this.scene.add.sprite(0, 0, 'characters', 0)
            .setOrigin(0.5, 1);
        this.add(this.character);

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.scene.physics.moveTo(this, pointer.worldX, pointer.worldY, 150);
            this.positionToMove = new Vector2(pointer.worldX, pointer.worldY);
        });
    }

    preUpdate (): void {
        let body = this.body as Phaser.Physics.Arcade.Body;
        if (this.positionToMove !== null && Phaser.Math.Distance.Between(this.positionToMove.x, this.positionToMove.y, this.x, this.y) <= 5) {
            this.positionToMove = null;
            body.setVelocity(0, 0);
        }

        if (body.velocity.x < 0) {
            this.setScale(-PlayerCharacter.SCALE, PlayerCharacter.SCALE);
        } else if (body.velocity.x > 0) {
            this.setScale(PlayerCharacter.SCALE, PlayerCharacter.SCALE);
        }

        if (Math.abs(body.velocity.x) !== 0 || Math.abs(body.velocity.y) !== 0) {
            this.character.anims.play('playerCharacterWalk', true);
        } else if (Math.abs(body.velocity.x) === 0 && Math.abs(body.velocity.y) === 0) {
            this.character.setFrame(0);
            this.character.anims.stop();
        }
    }
}
