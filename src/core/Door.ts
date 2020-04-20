import GameScene from "scenes/GameScene";
import Highlightable from "core/Highlightable";
import {Depths} from "enums/Depths";
import PlayerCharacter from "entity/PlayerCharacter";

declare let window: any;

export default class Door extends Phaser.GameObjects.Container {

    private highlight: Highlightable;
    private player: PlayerCharacter
    private registerOpenShop: boolean = false;

    constructor(scene: GameScene, x: number, y: number, player: PlayerCharacter) {
        super(scene, x, y, []);
        this.player = player;
        this.scene.add.existing(this);

        this.setDepth(Depths.UNDER_PLAYER);

        let image = this.scene.add.image(0, 0, 'assets', 'game_door')
            .setOrigin(0, 1);
        this.add(image);

        this.highlight = new Highlightable(scene, this, 'Animal shop');

        this.highlight.setInteractiveAreaAndHighlight('game_door_highlight', 30, -50, true, -38, -70);

        this.highlight.events.on(Highlightable.CLICK, () => {
            console.log('register click');
            this.registerOpenShop = true;
        });
    }

    preUpdate (): void {
        if (this.registerOpenShop && Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) < 25) {
            this.scene.events.emit('openshop');
            console.log('open shop');
            this.registerOpenShop = false;
        }
    }
}
