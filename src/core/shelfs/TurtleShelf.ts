import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class TurtleShelf extends AbstractShelf {

    private previousX: number = 0;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.TURTLE);

        this.animalImage = this.scene.add.image(55, -52, 'assets', 'game_turtle');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(41, -56, 'assets', 'game_turtle_aquarium_glass');
        this.add(this.cage);

        this.setInteractiveAreaAndHighlight('game_turtle_highlight', 41, -56);

        this.scene.add.tween({
            targets: this.animalImage,
            x: 30,
            duration: Phaser.Math.RND.between(4000, 5000),
            repeatDelay: Phaser.Math.RND.between(500, 1500),
            loopDelay: Phaser.Math.RND.between(500, 1500),
            delay: Phaser.Math.RND.between(450, 1500),
            yoyo: true,
            repeat: Infinity
        });
    }

    preUpdate (): void {
        if (this.previousX < this.animalImage.x) {
            this.animalImage.setScale(-1, 1);
        } else {
            this.animalImage.setScale(1, 1);
        }
        this.previousX = this.animalImage.x;
    }
}
