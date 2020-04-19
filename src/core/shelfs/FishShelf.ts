import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class FishShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.FISH);

        this.animalImage = this.scene.add.image(25, -52, 'assets', 'game_fish_orange');
        this.add(this.animalImage);
        this.animalImage2 = this.scene.add.image(50, -52, 'assets', 'game_fish_red');
        this.add(this.animalImage2);

        this.cage = this.scene.add.image(41, -53, 'assets', 'game_fishes_aquarium_glass');
        this.add(this.cage);
    }
}
