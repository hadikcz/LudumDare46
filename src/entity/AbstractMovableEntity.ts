import Phaser from 'phaser';
import GameScene from "scenes/GameScene";
import Vector2 = Phaser.Math.Vector2;
import {Depths} from "enums/Depths";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import WorldEnvironment from "core/WorldEnvironment";

export default abstract class AbstractMovableEntity extends Phaser.GameObjects.Container implements Phaser.GameObjects.GameObject {

    public scene!: GameScene;
    protected pathfinding: MatrixWorld;
    protected path: Vector2[] = [];
    private static readonly SCALE: number = 3;
    private shadow: Phaser.GameObjects.Graphics;
    private character: Phaser.GameObjects.Sprite;

    constructor(scene: GameScene, x: number, y: number, pathfinding: MatrixWorld) {
        super(scene, x, y, []);
        this.pathfinding = pathfinding;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        let body = this.body as Phaser.Physics.Arcade.Body;

        body.setFriction(100, 100);
        this.setScale(AbstractMovableEntity.SCALE);
        this.setDepth(Depths.CHARACTER_ABOVE_DESK);

        this.scene.anims.create({
            key: 'playerCharacterWalk',
            frames: this.scene.anims.generateFrameNumbers('characters', { start: 0, end: 3, first: 0 }),
            frameRate: 8,
            repeat: -1
        });

        this.shadow = this.scene.add.graphics({x: 0, y: 0});
        this.shadow.fillStyle(0x000, 0.4);
        this.shadow.fillEllipse(0, 0, 16, 8);
        this.add(this.shadow);

        this.character = this.scene.add.sprite(0, 0, 'characters', 0)
            .setOrigin(0.5, 1);
        this.add(this.character);
    }

    preUpdate (): void {
        let body = this.body as Phaser.Physics.Arcade.Body;

        if (body.velocity.x < 0) {
            this.setScale(-AbstractMovableEntity.SCALE, AbstractMovableEntity.SCALE);
        } else if (body.velocity.x > 0) {
            this.setScale(AbstractMovableEntity.SCALE, AbstractMovableEntity.SCALE);
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
            body.setVelocity(0, 0);
            this.reachTarget();
        }

        this.shadow.setVisible(true);
        // check depth against other things
        if (this.y <= 250) {
            if (this.x <= 364) {
                this.shadow.setVisible(false);
            }
            this.setDepth(Depths.CHARACTER_UNDER_DESK);

        } else if (this.y <= WorldEnvironment.SHELF_SECOND_ROW_DEPTH) {
            this.setDepth(Depths.CHARACTER_UNDER_SHELF);
        } else {
            this.setDepth(Depths.CHARACTER_ABOVE_SHELF);
        }
    }

    protected reachTarget (): void {
        // console.log(`Reach target`);
    }
}
