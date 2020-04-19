import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class DogShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.DOG);

        this.animalImage = this.scene.add.image(71, -63, 'assets', 'game_dog');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(60, -65, 'assets', 'game_dog_cage');
        this.add(this.cage);
    }
}
