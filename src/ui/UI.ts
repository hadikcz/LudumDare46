import $ from 'jquery';
import GameConfig from 'config/GameConfig';
import GameScene from 'scenes/GameScene';
import WorldEnvironment from "core/WorldEnvironment";
import Text = Phaser.GameObjects.Text;
import GameState from "core/GameState";

export default class UI {

    private scene: GameScene;
    private balance!: Text;
    private gameState: GameState;

    constructor (scene: GameScene, gameState: GameState) {
        this.scene = scene;
        this.gameState = gameState;

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + 10, WorldEnvironment.ORIGIN_POINT.y - 20, 'assets', 'game_coin');
        this.balance = this.scene.add.text(WorldEnvironment.ORIGIN_POINT.x + 25, WorldEnvironment.ORIGIN_POINT.y - 43, '10', { fontFamily: 'ARCADECLASSIC, Arial', fontSize: 120, color: '#feda09', align: 'center' }).setScale(0.3);
        this.balance.setStroke('#7c6e1b', 10);

        this.gameState.events.on(GameState.COIN_UPDATE, (newBalance: number) => {
            this.balance.setText(newBalance.toString());
        });

        this.show();
        $('html').addClass('black-bg');
        $('body').addClass('black-bg');
    }

    show (): void {
        $('.ingame-ui').fadeIn(GameConfig.UI.fadeInOutDelay);
    }

    hide (): void {
        $('.ingame-ui').fadeOut(GameConfig.UI.fadeInOutDelay);
    }
}
