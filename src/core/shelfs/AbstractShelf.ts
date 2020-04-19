import GameScene from "scenes/GameScene";
import {ShelfState} from "enums/ShelfState";
import Image = Phaser.GameObjects.Image;
import {Shelfs} from "enums/Shelfs";
import {Depths} from "enums/Depths";

export default abstract class AbstractShelf extends Phaser.GameObjects.Container {

    protected scene: GameScene;
    protected shelfType: Shelfs;
    protected lives: number = 10;
    protected shelfState: ShelfState = ShelfState.OK;
    protected shelfImage: Image;

    constructor(scene: GameScene, x: number, y: number, shelfType: Shelfs) {
        super(scene, x, y, []);
        this.scene = scene;
        this.shelfType = shelfType;

        this.scene.add.existing(this);
        this.setDepth(Depths.SHELF);

        this.shelfImage = this.scene.add.image(0, 0, 'assets', shelfType)
            .setOrigin(0, 1);
        this.add(this.shelfImage);
    }
}
