import $ from 'jquery';
import * as dat from 'dat.gui';
import EffectManager from "effects/EffectManager";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import Phaser from 'phaser';
import PlayerCharacter from "entity/PlayerCharacter";
import UI from "ui/UI";
import WorldEnvironment from 'core/WorldEnvironment';

declare let window: any;

export default class GameScene extends Phaser.Scene {

    private effectManager!: EffectManager;
    private ui!: UI;
    private worldEnvironment!: WorldEnvironment;
    private matrixWorld!: MatrixWorld;
    private debugGui: any;

    private playerCharacter!: PlayerCharacter;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        this.initDebugUI();
        this.worldEnvironment = new WorldEnvironment(this);
        this.effectManager = new EffectManager(this);

        this.playerCharacter = new PlayerCharacter(this, 350, 356);
        this.matrixWorld = new MatrixWorld(this, this.debugGui);

        this.ui = new UI(this);
        this.ui.show();
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
        camera.open();
    }

}
