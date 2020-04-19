import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class SpiderShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.SPIDER);

        this.animalImage = this.scene.add.image(70, -49, 'assets', 'game_spider');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(45, -56, 'assets', 'game_spider_aquarium_glass');
        this.add(this.cage);

        this.scene.add.tween({
            targets: this.animalImage,
            x: 25,
            duration: 5000,
            yoyo: true,
            repeat: Infinity
        });
    }
}
