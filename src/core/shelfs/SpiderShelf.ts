import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class SpiderShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.SPIDER);

        this.animalImage = this.scene.add.image(37, -49, 'assets', 'game_spider');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(45, -56, 'assets', 'game_spider_aquarium_glass');
        this.add(this.cage);
    }
}
