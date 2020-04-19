import GameScene from "scenes/GameScene";
import {ShelfState} from "enums/ShelfState";
import Image = Phaser.GameObjects.Image;
import {Shelfs} from "enums/Shelfs";
import {Depths} from "enums/Depths";
import WorldEnvironment from "core/WorldEnvironment";

export default abstract class AbstractShelf extends Phaser.GameObjects.Container {

    protected scene: GameScene;
    protected shelfType: Shelfs;
    protected lives: number = 10;
    protected shelfState: ShelfState = ShelfState.OK;
    protected shelfImage: Image;
    protected animalImage: Image;
    protected cage!: Image;

    constructor(scene: GameScene, x: number, y: number, shelfType: Shelfs) {
        super(scene, x, y, []);
        this.scene = scene;
        this.shelfType = shelfType;

        this.scene.add.existing(this);
        if (this.y < WorldEnvironment.SHELF_SECOND_ROW_DEPTH) {
            this.setDepth(Depths.SHELF_UNDER_PLAYER);
        } else {
            this.setDepth(Depths.SHELF);
        }

        this.shelfImage = this.scene.add.image(0, 0, 'assets', shelfType)
            .setOrigin(0, 1);
        this.add(this.shelfImage);

        this.animalImage = this.scene.add.image(0, 0, '');
    }

    hideAnimal (): void {
        this.animalImage.setVisible(false);
    }

    showAnimal (): void {
        this.animalImage.setVisible(true);
    }
}
