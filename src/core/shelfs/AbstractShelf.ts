import GameScene from "scenes/GameScene";
import {ShelfState} from "enums/ShelfState";
import {Shelfs} from "enums/Shelfs";
import {Depths} from "enums/Depths";
import WorldEnvironment from "core/WorldEnvironment";
import Highlightable from "core/Highlightable";
import {AnimalConfig} from "types/AnimalConfig";
import NumberHelpers from "helpers/NumberHelpers";
import GameConfig from "config/GameConfig";
import Image = Phaser.GameObjects.Image;
import EventEmitter = Phaser.Events.EventEmitter;
import Vector2 = Phaser.Math.Vector2;

declare let window: any;

export default abstract class AbstractShelf extends Phaser.GameObjects.Container {

    public static readonly NEED_FOOD: 'need_food';
    public static readonly TOTAL_DIE: 'total_die';
    public static readonly NEED_CLEAN_POO: 'need_clean_poo';
    public static readonly DIE: 'die';

    public readonly highlight: Highlightable;
    public events: EventEmitter;
    protected shelfType: Shelfs;
    protected lives: number = 3;
    protected shelfState: ShelfState = ShelfState.OK;
    protected shelfImage: Image;
    protected animalImage: Image;
    protected animalImage2!: Image;
    protected cage!: Image;
    protected config!: AnimalConfig | null;
    protected pooIcon!: Image;
    protected feedIcon!: Image;
    protected dieIcon!: Image;
    protected smileIcon!: Image;
    protected diePermaIcon!: Image;
    private feedInterval!: Phaser.Time.TimerEvent | null;
    private pooInterval!: Phaser.Time.TimerEvent | null;

    protected title: string;

    constructor(scene: GameScene, x: number, y: number, shelfType: Shelfs, title: string = 'Unknown', config: AnimalConfig | null = null) {
        super(scene, x, y, []);
        this.shelfType = shelfType;
        this.title = title;
        this.config = config;
        this.events = new EventEmitter();
        this.highlight = new Highlightable(scene, this, title);
        if (config?.count) {
            this.lives = config?.count;
        }

        console.log(`Creating ${title}`);
        try {
            throw new Error('rr');
        } catch (e) {
            console.log(e);
        }

        this.scene.add.existing(this);

        if (config?.iconX && config.iconY) {
            this.pooIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_poop').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);
            this.feedIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_feed').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);
            this.dieIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_skull').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);
            this.diePermaIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_skull_permanent').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);
            this.smileIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_smile').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);

            this.scene.tweens.add({
                targets: [this.feedIcon, this.pooIcon],
                y: y + config?.iconY - 15,
                duration: 500,
                yoyo: true,
                repeat: Infinity,
                ease: Phaser.Math.Easing.Bounce.In
            });
        }

        if (this.y < WorldEnvironment.SHELF_SECOND_ROW_DEPTH) {
            this.setDepth(Depths.SHELF_UNDER_PLAYER);
        } else {
            this.setDepth(Depths.SHELF);
        }

        this.shelfImage = this.scene.add.image(0, 0, 'assets', shelfType)
            .setOrigin(0, 1);
        this.add(this.shelfImage);

        this.animalImage = this.scene.add.image(-10000, -10000, '');

        if (this.shelfType !== Shelfs.EMPTY) {
            this.setInteractive();
            this.startFeedInterval();
            this.startPooInterval();
        }
    }

    getPosition (): Vector2 {
        if (this.config?.moveX && this.config.moveY) {
            return new Vector2(this.x + this.config?.moveX, this.y + this.config?.moveY);
        }
        return new Vector2(this.x, this.y);
    }

    hideAnimal (): void {
        this.animalImage.setVisible(false);
        this.animalImage2?.setVisible(false);
    }

    showAnimal (): void {
        this.animalImage.setVisible(true);
        this.animalImage2?.setVisible(true);
    }

    getShelfType (): Shelfs {
        return this.shelfType;
    }

    public canDoJob (): boolean {
        console.log(this.shelfState);
        return (this.shelfState === ShelfState.WAITING_FOR_FEED || this.shelfState === ShelfState.WAITING_FOR_CLEAN) && this.lives > 0;
    }

    public doAction (finishCallback: any): void {
        console.log('start action');
        this.scene.time.addEvent({
            delay: this.getDurationTime(),
            callbackScope: this,
            callback: () => {
                finishCallback();
                this.finishAction();
            }
        });
    }

    public getDurationTime (): number {
        if (!this.config) return 0;

        if (this.shelfState === ShelfState.WAITING_FOR_CLEAN) {
            return this.config?.pooDuration;
        } else if (this.shelfState === ShelfState.WAITING_FOR_FEED) {
            return this.config?.feedDuration;
        } else {
            return 0;
        }
    }

    private finishAction (): void {
        if (this.scene === undefined) return;
        this.feedIcon.setVisible(false);
        this.pooIcon.setVisible(false);

        this.shelfState = ShelfState.OK;
        this.smileIcon.setVisible(true);
        this.smileIcon.setAlpha(1);

        let y = 0;
        if (this.config) {
            y = this.config.iconY;
        }
        this.smileIcon.y = this.y + y;
        this.scene.tweens.add({
            targets: this.smileIcon,
            alpha: 0,
            y: this.y + y - 100,
            duration: 5000,
        });
    }

    private startFeedInterval (): void {
        if (this.shelfState === ShelfState.WAITING_FOR_FEED || this.shelfState === ShelfState.WAITING_FOR_CLEAN) return;
        console.log(`startFeedInterval ${this.title}`);

        this.feedInterval = this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(this.config?.timeBetweenFeed[0], this.config?.timeBetweenFeed[1]) * 1000,
            callbackScope: this,
            repeat: Infinity,
            callback: () => {
                this.shelfState = ShelfState.WAITING_FOR_FEED;
                console.log(`Want feed ${this.title}`);
                this.feedIcon.setVisible(true);
                this.events.emit(AbstractShelf.NEED_FOOD);
                window.scene.time.addEvent({
                    delay: GameConfig.Animal.WaitForPooOrFoodBeforeDie * 1000,
                    callbackScope: this,
                    callback: () => {
                        this.animalDie();
                    }
                });
            }
        });
    }

    private startPooInterval (): void {
        if (this.shelfState === ShelfState.WAITING_FOR_FEED || this.shelfState === ShelfState.WAITING_FOR_CLEAN) return;
        console.log(`startPooInterval ${this.title}`);

        this.pooInterval = this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(this.config?.timeBetweenPoo[0], this.config?.timeBetweenPoo[1]) * 1000,
            callbackScope: this,
            repeat: Infinity,
            callback: () => {
                this.shelfState = ShelfState.WAITING_FOR_CLEAN;
                console.log(`Want clean poo ${this.title}`);
                this.pooIcon.setVisible(true);
                this.events.emit(AbstractShelf.NEED_CLEAN_POO);
                this.scene.time.addEvent({
                    delay: GameConfig.Animal.WaitForPooOrFoodBeforeDie * 1000,
                    callbackScope: this,
                    callback: () => {
                        this.animalDie();
                    }
                });
            }
        });
    }

    private animalDie (): void {
        this.lives--;
        this.feedIcon.setVisible(false);
        this.pooIcon.setVisible(false);
        this.shelfState = ShelfState.OK;

        this.dieIcon.setVisible(true);

        console.log(`Animal die ${this.title} ${this.lives}/${this.config?.count}`);
        if (this.lives <= 0) {
            this.totalAnimalDie();
        } else {
            let y = 0;
            if (this.config) {
                y = this.config.iconY;
            }
            this.scene.tweens.add({
                targets: this.dieIcon,
                alpha: 0,
                y: this.y + y - 100,
                duration: 5000,
            });
        }
    }

    private totalAnimalDie (): void {
        if (this.scene === undefined) return;
        console.log(`Whole animal die ${this.title} ${this.lives}/${this.config?.count}`);
        this.events.emit(AbstractShelf.TOTAL_DIE, this);
        this.feedInterval?.remove();
        this.pooInterval?.remove();
        this.hideAnimal();
        this.diePermaIcon.setVisible(true);
        let y = 0;
        if (this.config) {
            y = this.config.iconY;
        }
        this.scene.tweens.add({
            targets: this.diePermaIcon,
            alpha: 0,
            y: this.y + y - 100,
            duration: 5000,
        });
        this.destroy();
    }

    destroy(fromScene?: boolean): void {
        super.destroy(fromScene);
        if (this.pooIcon !== undefined)
            this.pooIcon.destroy(fromScene);

        if (this.feedIcon !== undefined)
            this.feedIcon.destroy(fromScene);

        if (this.dieIcon !== undefined)
            this.dieIcon.destroy(fromScene);

        if (this.diePermaIcon !== undefined)
            this.diePermaIcon.destroy(fromScene);

        if (this.smileIcon !== undefined)
            this.smileIcon.destroy(fromScene);

        if (this.highlight !== undefined)
            this.highlight.destroy(fromScene);
    }
}
