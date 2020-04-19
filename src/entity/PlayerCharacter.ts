import Phaser from 'phaser';
import GameScene from "scenes/GameScene";
import Vector2 = Phaser.Math.Vector2;
import {Depths} from "enums/Depths";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import ShelfManager from "core/ShelfManager";
import ProgressBarUI from "libs/ProgressBarUI";
import AbstractMovableEntity from "entity/AbstractMovableEntity";

export default class PlayerCharacter extends AbstractMovableEntity {

    public debugPath: boolean = sessionStorage.getItem('debugPath') && JSON.parse(sessionStorage.getItem('debugPath') as string) ? true : false;
    private shelfManager: ShelfManager;
    private isFreeze: boolean = false;
    private progressBar: ProgressBarUI;

    constructor(scene: GameScene, x: number, y: number, pathfinding: MatrixWorld, shelfManager: ShelfManager) {
        super(scene, x, y, pathfinding);
        this.shelfManager = shelfManager;

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

    public toogleDebugPath (): void {
        this.debugPath = !this.debugPath;
        sessionStorage.setItem('debugPath', JSON.stringify(this.debugPath));
    }

    protected reachTarget (): void {
        super.reachTarget();
        if (this.shelfManager.lastClick && !this.isFreeze && this.shelfManager.lastClick.canDoJob()) {
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
