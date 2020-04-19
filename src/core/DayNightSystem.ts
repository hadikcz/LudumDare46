import GameScene from "scenes/GameScene";

export default class DayNightSystem {

    private scene: GameScene;
    private currentTime: number = 0;
    private day: number = 1;

    constructor(scene: GameScene) {
        this.scene = scene;

        this.scene.time.addEvent({
            delay: 500,
            loop: true,
            callbackScope: this,
            callback: this._update
        });
    }

    getTime (): number {
        return this.currentTime;
    }

    /**
     * @private
     */
    _update () {
        console.log(this.currentTime);
        this.currentTime += 0.1;
        this.currentTime = parseFloat(this.currentTime.toFixed(1));
        if (this.currentTime > 24) {
            this.currentTime = 0;
            this.day++;
            this.scene.events.emit('changeDay', this.day);
            console.log('new day');
        }
    }
}
