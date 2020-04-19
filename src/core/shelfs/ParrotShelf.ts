import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class ParrotShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.PARROT, 'Parrot');

        this.animalImage = this.scene.add.image(80, -65, 'assets', 'game_parrot');
        this.add(this.animalImage);

        this.cage = this.scene.add.image(80, -65, 'assets', 'game_parrot_cage');
        this.add(this.cage);

        this.highlight.setInteractiveAreaAndHighlight('game_parrot_highlight', 80, -65);

        this.scene.add.tween({
            targets: this.animalImage,
            angle: -Phaser.Math.RND.between(20, 30),
            duration: Phaser.Math.RND.between(1000, 3000),
            yoyo: true,
            repeat: Infinity
        });
    }
}
