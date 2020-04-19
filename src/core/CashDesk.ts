import GameScene from "scenes/GameScene";
import Highlightable from "core/Highlightable";
import {Depths} from "enums/Depths";

export default class CashDesk extends Phaser.GameObjects.Container {

    private highlight: Highlightable;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);
        this.scene.add.existing(this);

        this.setDepth(Depths.SELL_DESK);

        let image = this.scene.add.image(0, 0, 'assets', 'game_prodejni_pult')
            .setOrigin(0, 1);
        this.add(image);

        this.highlight = new Highlightable(scene, this, 'Cash desk');

        this.highlight.setInteractiveAreaAndHighlight('game_prodejni_pult_highlight', 123, -46, true, -45, -60);
    }
}
