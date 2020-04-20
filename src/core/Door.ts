import GameScene from "scenes/GameScene";
import Highlightable from "core/Highlightable";
import {Depths} from "enums/Depths";

export default class Door extends Phaser.GameObjects.Container {

    private highlight: Highlightable;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);
        this.scene.add.existing(this);

        this.setDepth(Depths.UNDER_PLAYER);

        let image = this.scene.add.image(0, 0, 'assets', 'game_door')
            .setOrigin(0, 1);
        this.add(image);

        this.highlight = new Highlightable(scene, this, 'Animal shop');

        this.highlight.setInteractiveAreaAndHighlight('game_door_highlight', 30, -50, true, -38, -70);
    }
}
