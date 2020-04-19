import $ from 'jquery';
import * as dat from 'dat.gui';
import EffectManager from "effects/EffectManager";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import Phaser from 'phaser';
import PlayerCharacter from "entity/PlayerCharacter";
import UI from "ui/UI";
import WorldEnvironment from 'core/WorldEnvironment';
import Vector2 = Phaser.Math.Vector2;

declare let window: any;

export default class GameScene extends Phaser.Scene {

    private effectManager!: EffectManager;
    private ui!: UI;
    private worldEnvironment!: WorldEnvironment;
    private matrixWorld!: MatrixWorld;
    private debugGui: any;
    private debugPathLines!: Phaser.GameObjects.Group;

    private playerCharacter!: PlayerCharacter;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        this.initDebugUI();
        this.worldEnvironment = new WorldEnvironment(this);
        this.effectManager = new EffectManager(this);

        this.matrixWorld = new MatrixWorld(this, this.debugGui);
        this.playerCharacter = new PlayerCharacter(this, 350, 356, this.matrixWorld.easyStarWrapper);
        this.initDebugUiPlayer();

        this.ui = new UI(this);
        this.ui.show();

        this.debugPathLines = this.add.group();
    }

    update (): void {
        this.worldEnvironment.update();
        this.matrixWorld.update();
    }

    private initDebugUI (): void {
        this.debugGui = new dat.GUI({ autoPlace: false });
        $('#datGui').append(this.debugGui.domElement);

        let camera = this.debugGui.addFolder('Camera');
        camera.add(this.cameras.main, 'zoom').step(1).listen();
        camera.add(this.input.activePointer, 'worldX').step(1).listen();
        camera.add(this.input.activePointer, 'worldY').step(1).listen();
        camera.open();
    }

    private initDebugUiPlayer (): void {
        let player = this.debugGui.addFolder('Player');
        player.add(this.playerCharacter, 'x').step(1).listen();
        player.add(this.playerCharacter, 'y').step(1).listen();
        player.open();
    }

    public debugPath (points: Vector2[]): void {
        this.debugPathLines.clear(true);
        for (let i: number = 0; i < points.length; i++) {
            if (points[i + 1] === undefined) break;
            let a = points[i];
            let b = points[i + 1];
            let line = this.add.line(0, 0, a.x, a.y, b.x, b.y, 0x0000FF).setOrigin(0, 0);
            this.debugPathLines.add(line);
        }
    }

}
