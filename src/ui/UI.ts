import $ from 'jquery';
import GameConfig from 'config/GameConfig';
import GameScene from 'scenes/GameScene';
import WorldEnvironment from "core/WorldEnvironment";
import Text = Phaser.GameObjects.Text;
import GameState from "core/GameState";
import DayNightSystem from "core/DayNightSystem";
import {Depths} from "enums/Depths";
import ShopUI from "ui/ShopUI";

export default class UI {

    private scene: GameScene;
    private balance!: Text;
    private clock!: Text;
    private calendar!: Text;
    private gameState: GameState;
    private dayNightSystem: DayNightSystem;
    private shopUI: ShopUI;

    constructor (scene: GameScene, gameState: GameState, dayNightSystem: DayNightSystem) {
        this.scene = scene;
        this.gameState = gameState;
        this.dayNightSystem= dayNightSystem;
        this.shopUI = new ShopUI(this.scene, this.gameState);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + 10, WorldEnvironment.ORIGIN_POINT.y - 20, 'assets', 'game_coin').setDepth(Depths.UI);
        this.balance = this.scene.add.text(WorldEnvironment.ORIGIN_POINT.x + 25, WorldEnvironment.ORIGIN_POINT.y - 43, '10', { fontFamily: 'ARCADECLASSIC, Arial', fontSize: 120, color: '#feda09', align: 'center' }).setScale(0.3).setDepth(Depths.UI);
        this.balance.setStroke('#7c6e1b', 10);

        let moveX = 25;
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + 100 + moveX, WorldEnvironment.ORIGIN_POINT.y - 20, 'assets', 'game_clock').setDepth(Depths.UI);
        this.clock = this.scene.add.text(WorldEnvironment.ORIGIN_POINT.x + 120 + moveX, WorldEnvironment.ORIGIN_POINT.y - 43, '0', { fontFamily: 'ARCADECLASSIC, Arial', fontSize: 120, color: '#00b7ff', align: 'center' }).setScale(0.3).setDepth(Depths.UI);
        this.clock.setStroke('#0c6082', 10);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + 190 + moveX, WorldEnvironment.ORIGIN_POINT.y - 20, 'assets', 'game_calendar').setDepth(Depths.UI);
        this.calendar = this.scene.add.text(WorldEnvironment.ORIGIN_POINT.x + 210 + moveX, WorldEnvironment.ORIGIN_POINT.y - 43, '1', { fontFamily: 'ARCADECLASSIC, Arial', fontSize: 120, color: '#00b7ff', align: 'center' }).setScale(0.3).setDepth(Depths.UI);
        this.calendar.setStroke('#0c6082', 10);

        this.gameState.events.on('GameState.COIN_UPDATE', (newBalance: number) => {
            this.balance.setText(newBalance.toString());
        });

        this.show();
        $('html').addClass('black-bg');
        $('body').addClass('black-bg');
    }

    update () {
        this.balance.setText(this.gameState.getBalance().toFixed(0).toString());
        this.clock.setText(this.dayNightSystem.getTime().toFixed(0).toString());
        this.calendar.setText(this.dayNightSystem.getDay().toFixed(0).toString());
    }

    show (): void {
        $('.ingame-ui').fadeIn(GameConfig.UI.fadeInOutDelay);
    }

    hide (): void {
        $('.ingame-ui').fadeOut(GameConfig.UI.fadeInOutDelay);
    }
}
