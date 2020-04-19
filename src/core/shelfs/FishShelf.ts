import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";
import NumberHelpers from "helpers/NumberHelpers";

export default class FishShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.FISH);

        let rangeX = [20, 65];
        let rangeY = [-57, -48];
        this.animalImage = this.scene.add.image(NumberHelpers.randomIntInRange(rangeX[0], rangeX[1]), NumberHelpers.randomIntInRange(rangeY[0], rangeY[1]), 'assets', 'game_fish_orange');
        this.add(this.animalImage);
        this.animalImage2 = this.scene.add.image(NumberHelpers.randomIntInRange(rangeX[0], rangeX[1]), NumberHelpers.randomIntInRange(rangeY[0], rangeY[1]), 'assets', 'game_fish_red');
        this.add(this.animalImage2);

        this.cage = this.scene.add.image(41, -53, 'assets', 'game_fishes_aquarium_glass');
        this.add(this.cage);

        let duration = 5000;

        this.scene.add.tween({
            targets: this.animalImage,
            x: NumberHelpers.randomIntInRange(rangeX[0], rangeX[1]),
            y: NumberHelpers.randomIntInRange(rangeY[0], rangeY[1]),
            duration: duration,
            yoyo: true,
            repeat: Infinity
        });

        this.scene.add.tween({
            targets: this.animalImage2,
            x: NumberHelpers.randomIntInRange(rangeX[0], rangeX[1]),
            y: NumberHelpers.randomIntInRange(rangeY[0], rangeY[1]),
            duration: duration,
            yoyo: true,
            repeat: Infinity
        });
    }
}
