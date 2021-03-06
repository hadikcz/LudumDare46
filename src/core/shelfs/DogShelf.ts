import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";
import animals from 'structs/animals.json';
import {AnimalConfig} from "types/AnimalConfig";

export default class DogShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.DOG, 'Dog', animals.dog as AnimalConfig);
        console.log('creatingdoge');

        this.animalImage = this.scene.add.image(71, -63 + 7, 'assets', 'game_dog_body');
        this.add(this.animalImage);

        this.animalImage2 = this.scene.add.image(55, -83 + 7, 'assets', 'game_dog_head');
        this.add(this.animalImage2);

        this.cage = this.scene.add.image(60, -65, 'assets', 'game_dog_cage');
        this.add(this.cage);

        this.highlight.setInteractiveAreaAndHighlight('game_dog_highlight', 60, -65);
        if (this.config) {
            this.highlight.updateCount(this.config.count, this.config.count);
        }

        this.animalImage2.angle = 25;
        this.scene.add.tween({
            targets: this.animalImage2,
            angle: -Phaser.Math.RND.between(20, 30),
            duration: Phaser.Math.RND.between(1000, 3000),
            yoyo: true,
            repeat: Infinity
        });
    }
}
