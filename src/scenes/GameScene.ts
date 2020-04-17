import Phaser from 'phaser';
import WorldEnvironment from 'core/WorldEnvironment';
import EffectManager from "effects/EffectManager";
import UI from "ui/UI";
import TestEntity from "entity/TestEntity";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    private effectManager!: EffectManager;
    private ui!: UI;
    private worldEnvironment!: WorldEnvironment;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        this.cameras.main.setBackgroundColor('#78431b');

        this.worldEnvironment = new WorldEnvironment(this);
        this.effectManager = new EffectManager(this);

        let testEntity = new TestEntity(this, 50, 50);
        this.cameras.main.startFollow(testEntity);

        this.ui = new UI(this);
        this.ui.show();
    }
}
