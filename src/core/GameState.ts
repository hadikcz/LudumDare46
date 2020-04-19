import {Shelfs} from "enums/Shelfs";

export default class GameState {

    private balance: number = 5;
    // private day: 1;
    // private time: 0;
    private purchasedShelfs: Shelfs[];

    constructor () {
        this.purchasedShelfs = [
            Shelfs.BUNNY,
            Shelfs.DOG,
        ];
    }

    getPurchasedShelfs (): Shelfs[] {
        return this.purchasedShelfs;
    }

    getBalance (): number {
        return this.balance;
    }
}
