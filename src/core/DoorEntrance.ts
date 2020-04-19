import GameScene from "scenes/GameScene";
import Highlightable from "core/Highlightable";
import {Depths} from "enums/Depths";

export default class DoorEntrance extends Phaser.GameObjects.Container {

    private highlight: Highlightable;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);
        this.scene.add.existing(this);

        this.setDepth(Depths.ENTRANCE_DOOR);

        let image = this.scene.add.image(0, 0, 'assets', 'game_door_entrance')
            .setOrigin(0.5, 1)
            .setAlpha(0.8);

        this.add(image);

        this.highlight = new Highlightable(scene, this, 'Entrance');

        this.highlight.setInteractiveAreaAndHighlight('game_door_entrance_highlight', 0, -50, true, -27, -70);
    }
}
