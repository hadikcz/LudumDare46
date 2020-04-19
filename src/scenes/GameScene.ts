import $ from 'jquery';
import * as dat from 'dat.gui';
import EffectManager from "effects/EffectManager";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import Phaser from 'phaser';
import PlayerCharacter from "entity/PlayerCharacter";
import UI from "ui/UI";
import WorldEnvironment from 'core/WorldEnvironment';
import Vector2 = Phaser.Math.Vector2;
import ShelfManager from "core/ShelfManager";
import GameState from "core/GameState";
import Customer from "entity/Customer";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    private effectManager!: EffectManager;
    private ui!: UI;
    private worldEnvironment!: WorldEnvironment;
    private matrixWorld!: MatrixWorld;
    private debugGui: any;
    private debugPathLines!: Phaser.GameObjects.Group;

    private gameState!: GameState;
    private shelfManager!: ShelfManager;

    private playerCharacter!: PlayerCharacter;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        this.initDebugUI();
        this.input.topOnly = false;
        this.gameState = new GameState(this);
        this.worldEnvironment = new WorldEnvironment(this);
        this.effectManager = new EffectManager(this);

        this.matrixWorld = new MatrixWorld(this, this.debugGui);
        this.shelfManager = new ShelfManager(this, this.gameState);
        this.playerCharacter = new PlayerCharacter(this, 350, 356, this.matrixWorld, this.shelfManager);

        let customer = new Customer(this, 192, 410, this.matrixWorld);
        this.initDebugUiPlayer();

        this.ui = new UI(this, this.gameState, this.gameState.dayNightSystem);
        this.ui.show();

        this.debugPathLines = this.add.group();
    }

    update (): void {
        this.worldEnvironment.update();
        this.matrixWorld.update();
        this.ui.update();
    }

    private initDebugUI (): void {
        this.debugGui = new dat.GUI({ autoPlace: false });
        $('#datGui').append(this.debugGui.domElement);
        $('#datGui').hide();

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
        player.add(this.playerCharacter, 'toogleDebugPath');
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
