import {Shelfs} from "enums/Shelfs";
import EventEmitter = Phaser.Events.EventEmitter;
import DayNightSystem from "core/DayNightSystem";
import GameScene from "scenes/GameScene";

export default class GameState {

    public static readonly COIN_UPDATE: string = 'coinudpate';

    public events: EventEmitter;
    public dayNightSystem: DayNightSystem;
    private balance: number = 5;
    private day: number = 1;
    // private time: number = 0;
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

    getCurrentDay (): number {
        return this.day;
    }

    addDay (): void {
        this.day++;
    }

    getPurchasedShelfs (): Shelfs[] {
        return this.purchasedShelfs;
    }

    getBalance (): number {
        return this.balance;
    }

    addBalance (add: number): void {
        this.balance += Math.abs(add);
        this.events.emit(GameState.COIN_UPDATE, this.balance);
    }
}
