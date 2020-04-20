import {Shelfs} from "enums/Shelfs";
import DayNightSystem from "core/DayNightSystem";
import GameScene from "scenes/GameScene";
import EventEmitter = Phaser.Events.EventEmitter;

export default class GameState {

    public static readonly COIN_UPDATE: string = 'coinudpate';
    public static readonly UPDATE_SHELFS: string = 'uodateshelfs';

    public events: EventEmitter;
    public dayNightSystem: DayNightSystem;
    private balance: number = 10;
    private purchasedShelfs: Shelfs[];

    constructor (scene: GameScene) {
        this.dayNightSystem = new DayNightSystem(scene);
        this.events = new EventEmitter();

        this.purchasedShelfs = [
            Shelfs.FISH,
            Shelfs.PARROT,
            Shelfs.DOG,
            Shelfs.RAT,
            Shelfs.BUNNY,
            Shelfs.TURTLE,
            Shelfs.SPIDER,
        ];
        this.purchasedShelfs = [
            Shelfs.FISH,
            Shelfs.EMPTY,
            Shelfs.EMPTY,
            Shelfs.EMPTY,
            Shelfs.EMPTY,
            Shelfs.EMPTY,
            Shelfs.EMPTY,
        ];
    }

    removeShelf (shelf: Shelfs): void {
        let i = this.purchasedShelfs.indexOf(shelf);
        console.log('remove shelf i ' + i);
        this.purchasedShelfs[i] = Shelfs.EMPTY;
        this.events.emit('ShelfPurchased', i, Shelfs.EMPTY);
    }

    addShelf (shelf: Shelfs): void {
        let freeI = -1;
        for (let i = 0; i < this.purchasedShelfs.length; i++) {
            if (this.purchasedShelfs[i] === Shelfs.EMPTY) {
                freeI = i;
                break;
            }
        }
        this.purchasedShelfs[freeI] = shelf;

        this.events.emit('ShelfPurchased', freeI, shelf);
    }

    getPurchasedShelfs (): Shelfs[] {
        return this.purchasedShelfs;
    }

    getRealPurchasedShelfs (): Shelfs[] {
        return this.purchasedShelfs.filter((shelf) => {
            return shelf !== Shelfs.EMPTY;
        });
    }

    getBalance (): number {
        return this.balance;
    }

    takeBalance (value: number): void {
        this.balance -= value;
    }

    addBalance (add: number): void {
        console.log('purchase for ' + add);
        this.balance += Math.abs(add);
        this.events.emit('GameState.COIN_UPDATE', this.balance);
    }
}
