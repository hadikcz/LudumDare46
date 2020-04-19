import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class ParrotShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.PARROT);

        this.animalImage = this.scene.add.image(80, -65, 'assets', 'game_parrot');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(80, -65, 'assets', 'game_parrot_cage');
        this.add(this.cage);
    }
}
