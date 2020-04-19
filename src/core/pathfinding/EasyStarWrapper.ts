import easystarjs from 'easystarjs';

export default class EasyStarWrapper {

    private static readonly ACCEPTABLE_TILES: number[] = [-1, 0];
    private easyStar;

    constructor () {
        this.easyStar = new easystarjs.js();
        this.easyStar.setAcceptableTiles(EasyStarWrapper.ACCEPTABLE_TILES);
        this.easyStar.enableSync();
        this.easyStar.enableDiagonals();
    }
}
