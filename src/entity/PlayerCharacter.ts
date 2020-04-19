import Phaser from 'phaser';
import GameScene from "scenes/GameScene";
import Vector2 = Phaser.Math.Vector2;
import EasyStarWrapper from "core/pathfinding/EasyStarWrapper";

export default class PlayerCharacter extends Phaser.GameObjects.Container implements Phaser.GameObjects.GameObject {

    public scene!: GameScene;
    private static readonly SCALE: number = 3;
    private pathfinding: EasyStarWrapper;
    private character: Phaser.GameObjects.Sprite;
    private positionToMove: Vector2 | null = null;
    private path: Vector2[] = [];

    constructor(scene: GameScene, x: number, y: number, pathfinding: EasyStarWrapper) {
        super(scene, x, y, []);
        this.pathfinding = pathfinding;

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

        // y+5 because frame feets are not on the bottom
        this.character = this.scene.add.sprite(0, 0, 'characters', 0)
            .setOrigin(0.5, 1);
        this.add(this.character);

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.pathfinding.findPath(this.x, this.y, pointer.worldX, pointer.worldY, (status, points) => {
                if (status) {
                    this.path = points;
                }
                console.log([status, points]);
                this.scene.debugPath(points);
            }, this);
            // this.scene.physics.moveTo(this, pointer.worldX, pointer.worldY, 150);
            // this.positionToMove = new Vector2(pointer.worldX, pointer.worldY);
        });
    }

    preUpdate (): void {
        let body = this.body as Phaser.Physics.Arcade.Body;
        // if (this.positionToMove !== null && Phaser.Math.Distance.Between(this.positionToMove.x, this.positionToMove.y, this.x, this.y) <= 5) {
        //     this.positionToMove = null;
        //     body.setVelocity(0, 0);
        // }

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

        if (this.path.length > 0) {
            let currentTarget = this.path[0];
            if (Phaser.Math.Distance.Between(currentTarget.x, currentTarget.y, this.x, this.y) <= 5) {
                this.path.shift();
            }
            this.scene.physics.moveTo(this, currentTarget.x, currentTarget.y, 150);
        } else {
            this.positionToMove = null;
            body.setVelocity(0, 0);
        }
    }
}
