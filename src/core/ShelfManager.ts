import GameScene from "scenes/GameScene";
import AbstractShelf from "core/shelfs/AbstractShelf";
import EmptyShelf from "core/shelfs/EmptyShelf";
import shelfSlots from 'structs/shelfSlots.json';
import WorldEnvironment from "core/WorldEnvironment";
import GameState from "core/GameState";
import {Shelfs} from "enums/Shelfs";
import DogShelf from "core/shelfs/DogShelf";
import BunnyShelf from "core/shelfs/BunnyShelf";
import RatShelf from "core/shelfs/RatShelf";
import ParrotShelf from "core/shelfs/ParrotShelf";
import TurtleShelf from "core/shelfs/TurtleShelf";

export default class ShelfManager {

    public static readonly SHELF_COUNT: number = 7;

    private scene: GameScene;
    private gameState: GameState;
    private shelfs: AbstractShelf[] = [];

    constructor (scene: GameScene, gameState: GameState) {
        this.scene = scene;
        this.gameState = gameState;

        this.createShelfs();
    }

    private createShelfs (): void {
        let shelf: AbstractShelf;

        // fill with empty shelfs
        for (let i: number = 0; i < ShelfManager.SHELF_COUNT; i++) {
            let position = shelfSlots[i];
            let shelfType: Shelfs | null = this.gameState.getPurchasedShelfs()[i] || null;

            shelf = this.generateShelf(position.x, position.y, shelfType);
            this.shelfs.push(shelf);
        }
    }

    private generateShelf (x: number, y: number, shelf: Shelfs | null = null): AbstractShelf {
        x = x + WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x;
        y = y + WorldEnvironment.ORIGIN_POINT.y;
        switch (shelf) {
            case Shelfs.DOG:
                return new DogShelf(this.scene, x, y);
            case Shelfs.BUNNY:
                return new BunnyShelf(this.scene, x, y);
            case Shelfs.RAT:
                return new ParrotShelf(this.scene, x, y);
            case Shelfs.PARROT:
                return new RatShelf(this.scene, x, y);
            case Shelfs.TURTLE:
                return new TurtleShelf(this.scene, x, y);
            case Shelfs.EMPTY:
                return new EmptyShelf(this.scene, x, y);
            default:
                return new EmptyShelf(this.scene, x, y);
        }
    }
}
