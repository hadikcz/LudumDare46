import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class RatShelf extends AbstractShelf {

    private previousX: number = 0;
    private previous2X: number = 0;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.RAT, 'Hamster');

        this.animalImage = this.scene.add.image(20, -60, 'assets', 'game_rat_in_cage');
        this.add(this.animalImage);

        this.animalImage2 = this.scene.add.image(55, -60, 'assets', 'game_rat_in_cage2');
        this.add(this.animalImage2);

        this.cage = this.scene.add.image(42, -59, 'assets', 'game_rat_cage');
        this.add(this.cage);

        this.setInteractiveAreaAndHighlight('game_rat_highlight', 42, -59);

        let duration = 5000;
        this.scene.add.tween({
            targets: this.animalImage,
            x: 55,
            duration: duration,
            yoyo: true,
            repeatDelay: Phaser.Math.RND.between(450, 750),
            loopDelay: Phaser.Math.RND.between(450, 500),
            delay: Phaser.Math.RND.between(0, 350),
            repeat: Infinity
        });

        this.scene.add.tween({
            targets: this.animalImage2,
            x: 25,
            duration: duration,
            yoyo: true,
            repeatDelay: Phaser.Math.RND.between(450, 750),
            loopDelay: Phaser.Math.RND.between(450, 500),
            delay: Phaser.Math.RND.between(1000, 2500),
            repeat: Infinity
        });
    }

    preUpdate (): void {
        if (this.previousX < this.animalImage.x) {
            this.animalImage.setScale(1, 1);
        } else {
            this.animalImage.setScale(-1, 1);
        }
        this.previousX = this.animalImage.x;

        if (this.previous2X < this.animalImage2.x) {
            this.animalImage2.setScale(-1, 1);
        } else {
            this.animalImage2.setScale(1, 1);
        }
        this.previous2X = this.animalImage2.x;
    }
}
