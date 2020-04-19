import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class TurtleShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.TURTLE);

        this.animalImage = this.scene.add.image(37, -52, 'assets', 'game_turtle');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(41, -56, 'assets', 'game_turtle_aquarium_glass');
        this.add(this.cage);
    }
}
