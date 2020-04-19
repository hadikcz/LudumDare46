import $ from 'jquery';
import GameConfig from 'config/GameConfig';
import GameScene from 'scenes/GameScene';

export default class UI {

    private scene: GameScene;

    constructor (scene: GameScene) {
        this.scene = scene;

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
