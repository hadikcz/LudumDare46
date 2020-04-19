import GameScene from "scenes/GameScene";
import AbstractShelf from "core/shelfs/AbstractShelf";
import EmptyShelf from "core/shelfs/EmptyShelf";
import shelfSlots from 'structs/shelfSlots.json';
import WorldEnvironment from "core/WorldEnvironment";
import {Depths} from "enums/Depths";

export default class ShelfManager {

    public static readonly SHELF_COUNT: number = 7;

    private scene: GameScene;
    private shelfs: AbstractShelf[] = [];

    constructor (scene: GameScene) {
        this.scene = scene;

        this.createShelfs();
    }

    private createShelfs (): void {
        let shelf: AbstractShelf;

        // fill with empty shelfs
        for (let i: number = 0; i < ShelfManager.SHELF_COUNT; i++) {
            let position = shelfSlots[i];
            shelf = new EmptyShelf(this.scene, position.x + WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x, position.y + WorldEnvironment.ORIGIN_POINT.y);
            this.shelfs.push(shelf);
        }
    }
}
