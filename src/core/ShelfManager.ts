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
import Group = Phaser.GameObjects.Group;

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

        this.gameState.events.on('ShelfPurchased', (position: number, type: Shelfs) => {
            this.shelfPurchased(position, type);
        });
    }

    preUpdate (): void {
    }

    private createShelfs (): void {
        // fill with empty shelfs
        for (let i: number = 0; i < ShelfManager.SHELF_COUNT; i++) {
            this.createShelf(i);
        }
    }

    private createShelf (i: number): void {
        let shelf: AbstractShelf;
        let position = shelfSlots[i];
        let shelfType: Shelfs | null = this.gameState.getPurchasedShelfs()[i] || null;

        shelf = this.generateShelf(position.x, position.y, shelfType);
        shelf.highlight.events.on('Highlightable.CLICK', (shelfP) => {
            this.clickOnShelf(shelfP);
        });

        shelf.events.once('total_die', (shelfMe) => {
            console.log(shelfMe);
            this.shelfTotalDie(shelfMe);
        });
        this.shelfs[i] =  shelf;
    }

    private shelfPurchased (position: number, type: Shelfs): void {
        this.createShelf(position);
        // this.shelfs.clear();
        // this.createShelfs();
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
                return new RatShelf(this.scene, x, y);
            case Shelfs.PARROT:
                return new ParrotShelf(this.scene, x, y);
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
        console.log('!!!!!! **** shelfTotalDie ***** !!!!!');
        // return; //@TODO : infinite loop and crash here
        this.gameState.removeShelf(shelf.getShelfType());
        // let i = this.shelfs.getChildren().indexOf(shelf);
        // this.shelfs.getChildren().splice(i, 1);

        if (this.lastClick === shelf) {
            this.lastClick = null;
        }
        if (this.clickedShelf === shelf) {
            this.clickedShelf = null;
        }
        shelf.destroy(true);
        // this.updateShelfs();
    }
}
