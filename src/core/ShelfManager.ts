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
import SpiderShelf from "core/shelfs/SpiderShelf";
import FishShelf from "core/shelfs/FishShelf";
import Highlightable from "core/Highlightable";

export default class ShelfManager {

    public static readonly SHELF_COUNT: number = 7;
    public clickedShelf: AbstractShelf | null = null;
    public lastClick: AbstractShelf | null = null;

    private scene: GameScene;
    private gameState: GameState;
    private shelfs: AbstractShelf[] = [];

    constructor (scene: GameScene, gameState: GameState) {
        this.scene = scene;
        this.gameState = gameState;

        this.createShelfs();

        this.gameState.events.on(GameState.UPDATE_SHELFS, () => {
            this.updateShelfs();
        });
    }

    private createShelfs (): void {
        let shelf: AbstractShelf;

        // fill with empty shelfs
        for (let i: number = 0; i < ShelfManager.SHELF_COUNT; i++) {
            let position = shelfSlots[i];
            let shelfType: Shelfs | null = this.gameState.getPurchasedShelfs()[i] || null;

            shelf = this.generateShelf(position.x, position.y, shelfType);
            shelf.highlight.events.on(Highlightable.CLICK, (shelfP) => {
                this.clickOnShelf(shelfP);
            });

            shelf.events.once(AbstractShelf.TOTAL_DIE, () => {
                this.shelfTotalDie(shelf);
            });
            this.shelfs.push(shelf);
        }
    }

    private updateShelfs (): void {
        this.shelfs.forEach((shelf) => {
            shelf.destroy(true);
        });

        this.createShelfs();
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
            case Shelfs.SPIDER:
                return new SpiderShelf(this.scene, x, y);
            case Shelfs.FISH:
                return new FishShelf(this.scene, x, y);
            case Shelfs.EMPTY:
                return new EmptyShelf(this.scene, x, y);
            default:
                return new EmptyShelf(this.scene, x, y);
        }
    }

    private clickOnShelf (shelf: AbstractShelf): void {
        this.clickedShelf = shelf;
        this.lastClick = shelf;
        this.scene.time.addEvent({
            delay: 500,
            callbackScope: this,
            callback: () => {
                this.clickedShelf = null;
            }
        });
    }

    private shelfTotalDie (shelf: AbstractShelf): void {
        // return; //@TODO : infinite loop and crash here
        let i = this.shelfs.indexOf(shelf);
        this.shelfs.splice(i, 1);
        shelf.destroy();
        this.updateShelfs();
    }
}
