import Phaser from 'phaser';
import GameScene from "scenes/GameScene";
import Vector2 = Phaser.Math.Vector2;
import {Depths} from "enums/Depths";
import Tween = Phaser.Tweens.Tween;
import MatrixWorld from "core/pathfinding/MatrixWorld";
import WorldEnvironment from "core/WorldEnvironment";
import ShelfManager from "core/ShelfManager";
import ProgressBarUI from "libs/ProgressBarUI";

export default class PlayerCharacter extends Phaser.GameObjects.Container implements Phaser.GameObjects.GameObject {

    public scene!: GameScene;
    public debugPath: boolean = sessionStorage.getItem('debugPath') && JSON.parse(sessionStorage.getItem('debugPath') as string) ? true : false;
    private static readonly SCALE: number = 3;
    private pathfinding: MatrixWorld;
    private shadow: Phaser.GameObjects.Graphics;
    private character: Phaser.GameObjects.Sprite;
    private positionToMove: Vector2 | null = null;
    private path: Vector2[] = [];
    private shadowAnimation: Tween;
    private shelfManager: ShelfManager;
    private isFreeze: boolean = false;
    private progressBar: ProgressBarUI;

    constructor(scene: GameScene, x: number, y: number, pathfinding: MatrixWorld, shelfManager: ShelfManager) {
        super(scene, x, y, []);
        this.pathfinding = pathfinding;
        this.shelfManager = shelfManager;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        let body = this.body as Phaser.Physics.Arcade.Body;

        body.setFriction(100, 100);
        this.setScale(PlayerCharacter.SCALE);
        this.setDepth(Depths.CHARACTER_ABOVE_DESK);

        this.progressBar = new ProgressBarUI(this.scene, {
            followTarget: this,
            atlas: 'assets',
            atlasBg: 'progress_bar_bg',
            atlasBar: 'progress_bar_inner',
            tintBar: 0x00FF00,
            depth: Depths.UI,
            offsetX: -30,
            offsetY: 10
        });
        this.progressBar.setPercent(0);
        this.progressBar.hide();

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

        this.shadowAnimation = this.scene.tweens.add({
            targets: this.shadow,
            scaleX: 0.6,
            scaleY: 0.6,
            yoyo: true,
            repeat: Infinity,
            duration: 200
        }).pause();

        // y+5 because frame feets are not on the bottom
        this.character = this.scene.add.sprite(0, 0, 'characters', 0)
            .setOrigin(0.5, 1);
        this.add(this.character);

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isFreeze) return;
            setTimeout(() => {
                let moveTo = new Vector2(pointer.worldX, pointer.worldY);

                if (this.shelfManager.clickedShelf) {
                    moveTo.set(this.shelfManager.clickedShelf.getPosition().x, this.shelfManager.clickedShelf.getPosition().y);
                    this.shelfManager.clickedShelf = null;
                } else {
                    this.shelfManager.lastClick = null;
                }

                this.pathfinding.findPath(this.x, this.y, moveTo.x, moveTo.y, (status, points) => {
                    if (status) {
                        points.splice(0, 1);
                        this.path = points;
                    }
                    if (this.debugPath)
                        this.scene.debugPath(points);
                }, true, this);
            }, 0);
        });
    }

    preUpdate (): void {
        let body = this.body as Phaser.Physics.Arcade.Body;

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

    public toogleDebugPath (): void {
        this.debugPath = !this.debugPath;
        sessionStorage.setItem('debugPath', JSON.stringify(this.debugPath));
    }

    private reachTarget (): void {
        if (this.shelfManager.lastClick && !this.isFreeze && this.shelfManager.lastClick.canDoJob()) {
            console.log(`Reach target`);
            this.freeze();
            this.progressBar.setPercent(0);
            this.progressBar.show();

            let started = Math.round(Date.now());
            let target = Math.round(this.shelfManager.lastClick?.getDurationTime());
            let interval = setInterval(() => {
                let current = Math.round(Date.now()) - started;
                let percent = (current / target) * 100;
                this.progressBar.setPercent(percent);
            }, 10);


            this.shelfManager.lastClick.doAction(() => {
                clearInterval(interval);
                console.log('finished job');
                this.shelfManager.lastClick = null;
                this.progressBar.hide();
                this.unfreeze();
            });
        }
    }

    private freeze (): void {
        this.isFreeze = true;
    }

    private unfreeze (): void {
        this.isFreeze = false;
    }
}
