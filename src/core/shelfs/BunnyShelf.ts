import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class BunnyShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.BUNNY);

        this.animalImage = this.scene.add.image(85, -60, 'assets', 'game_bunny');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(60, -75, 'assets', 'game_bunny_cage');
        this.add(this.cage);
    }
}
