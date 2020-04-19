import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class RatShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.RAT);

        this.animalImage = this.scene.add.image(20, -60, 'assets', 'game_rat_in_cage');
        this.add(this.animalImage);

        this.animalImage2 = this.scene.add.image(55, -60, 'assets', 'game_rat_in_cage2');
        this.add(this.animalImage2);

        this.cage = this.scene.add.image(42, -59, 'assets', 'game_rat_cage');
        this.add(this.cage);
    }
}
