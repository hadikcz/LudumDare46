import {Shelfs} from "enums/Shelfs";
import EventEmitter = Phaser.Events.EventEmitter;
import DayNightSystem from "core/DayNightSystem";
import GameScene from "scenes/GameScene";

export default class GameState {

    public static readonly COIN_UPDATE: string = 'coinudpate';
    public static readonly UPDATE_SHELFS: string = 'uodateshelfs';

    public events: EventEmitter;
    public dayNightSystem: DayNightSystem;
    private balance: number = 15;
    private purchasedShelfs: Shelfs[];

    constructor (scene: GameScene) {
        this.dayNightSystem = new DayNightSystem(scene);
        this.events = new EventEmitter();

        this.purchasedShelfs = [
            // Shelfs.PARROT,
            // Shelfs.DOG,
            // Shelfs.RAT,
            // Shelfs.BUNNY,
            // Shelfs.TURTLE,
            // Shelfs.SPIDER,
            // Shelfs.FISH,
        ];
    }

    addShelf (shelf: Shelfs): void {
        this.purchasedShelfs.push(shelf);
        this.events.emit(GameState.UPDATE_SHELFS);
    }

    getPurchasedShelfs (): Shelfs[] {
        return this.purchasedShelfs;
    }

    getBalance (): number {
        return this.balance;
    }

    takeBalance (value: number): void {
        this.balance -= value;
    }

    addBalance (add: number): void {
        this.balance += Math.abs(add);
        this.events.emit(GameState.COIN_UPDATE, this.balance);
    }
}
