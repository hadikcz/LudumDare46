import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";
import {AnimalConfig} from "types/AnimalConfig";
import animals from 'structs/animals.json';

export default class BunnyShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.BUNNY, 'Rabbit', animals.bunny as AnimalConfig);

        this.animalImage = this.scene.add.image(81, -60, 'assets', 'game_bunny').setScale(0.86);
        this.add(this.animalImage);

        this.cage = this.scene.add.image(60, -75, 'assets', 'game_bunny_cage');
        this.add(this.cage);

        this.highlight.setInteractiveAreaAndHighlight('game_bunny_highlight', 79, -61);
        if (this.config) {
            this.highlight.updateCount(this.config.count, this.config.count);
        }

        this.scene.add.tween({
            targets: this.animalImage,
            angle: -Phaser.Math.RND.between(10, 15),
            duration: Phaser.Math.RND.between(1000, 1500),
            delay: Phaser.Math.RND.between(1000, 3000),
            yoyo: true,
            repeat: Infinity
        });
    }
}
