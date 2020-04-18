import Phaser from 'phaser';
import WorldEnvironment from 'core/WorldEnvironment';
import EffectManager from "effects/EffectManager";
import UI from "ui/UI";
import PlayerCharacter from "entity/PlayerCharacter";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    private effectManager!: EffectManager;
    private ui!: UI;
    private worldEnvironment!: WorldEnvironment;

    private playerCharacter!: PlayerCharacter;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {

        this.worldEnvironment = new WorldEnvironment(this);
        this.effectManager = new EffectManager(this);

        this.playerCharacter = new PlayerCharacter(this, 350, 356);
        // this.cameras.main.setOrigin(0, 0);
        // this.cameras.main.setPosition(GameConfig.World.size.width / 2, GameConfig.World.size.width / 2);

        this.ui = new UI(this);
        this.ui.show();
    }

    update (): void {
        this.worldEnvironment.update();
        // console.log([this.input.activePointer.worldX - WorldEnvironment.ORIGIN_POINT.x - WorldEnvironment.ORIGIN_POINT_INNER.x, this.input.activePointer.worldY - WorldEnvironment.ORIGIN_POINT.y]);
    }
}
