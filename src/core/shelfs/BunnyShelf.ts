import AbstractShelf from "core/shelfs/AbstractShelf";
import GameScene from "scenes/GameScene";
import {Shelfs} from "enums/Shelfs";

export default class BunnyShelf extends AbstractShelf {

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, Shelfs.BUNNY);
    }
}
