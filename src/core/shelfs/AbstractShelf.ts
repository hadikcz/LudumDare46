import GameScene from "scenes/GameScene";
import {ShelfState} from "enums/ShelfState";
import {Shelfs} from "enums/Shelfs";
import {Depths} from "enums/Depths";
import WorldEnvironment from "core/WorldEnvironment";
import Highlightable from "core/Highlightable";
import {AnimalConfig} from "types/AnimalConfig";
import NumberHelpers from "helpers/NumberHelpers";
import Image = Phaser.GameObjects.Image;
import EventEmitter = Phaser.Events.EventEmitter;
import GameConfig from "config/GameConfig";

export default abstract class AbstractShelf extends Phaser.GameObjects.Container {

    public static readonly NEED_FOOD: 'need_food';
    public static readonly NEED_CLEAN_POO: 'need_clean_poo';
    public static readonly DIE: 'die';

    public readonly highlight: Highlightable;
    protected events: EventEmitter;
    protected scene: GameScene;
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
    protected diePermaIcon!: Image;
    private feedInterval!: Phaser.Time.TimerEvent | null;
    private pooInterval!: Phaser.Time.TimerEvent | null;

    protected title: string;

    constructor(scene: GameScene, x: number, y: number, shelfType: Shelfs, title: string = 'Unknown', config: AnimalConfig | null = null) {
        super(scene, x, y);
        this.scene = scene;
        this.shelfType = shelfType;
        this.title = title;
        this.config = config;
        this.events = new EventEmitter();
        this.highlight = new Highlightable(scene, this, title);
        if (config?.count) {
            this.lives = config?.count;
        }

        this.scene.add.existing(this);

        if (config?.iconX && config.iconY) {
            this.pooIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_poop').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);
            this.feedIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_feed').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);
            this.dieIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_skull').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);
            this.diePermaIcon = this.scene.add.image(x + config?.iconX, y + config?.iconY, 'assets', 'game_skull_permanent').setOrigin(0.5, 0.5).setDepth(Depths.UI_ICONS).setVisible(false);

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

        this.setInteractive();

        this.startFeedInterval();
        this.startPooInterval();
    }

    hideAnimal (): void {
        this.animalImage.setVisible(false);
        this.animalImage2?.setVisible(false);
    }

    showAnimal (): void {
        this.animalImage.setVisible(true);
        this.animalImage2?.setVisible(true);
    }

    private startFeedInterval (): void {
        // if (this.shelfState === ShelfState.WAITING_FOR_FEED) return this.startFeedInterval();
        console.log(`startFeedInterval ${this.title}`);

        this.feedInterval = this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(this.config?.timeBetweenFeed[0], this.config?.timeBetweenFeed[1]) * 1000,
            callbackScope: this,
            repeat: Infinity,
            callback: () => {
                console.log(`Want feed ${this.title}`);
                this.feedIcon.setVisible(true);
                this.events.emit(AbstractShelf.NEED_FOOD);
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

    private startPooInterval (): void {
        // if (this.shelfState === ShelfState.WAITING_FOR_CLEAN) return this.startPooInterval();
        console.log(`startPooInterval ${this.title}`);

        this.pooInterval = this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(this.config?.timeBetweenPoo[0], this.config?.timeBetweenPoo[1]) * 1000,
            callbackScope: this,
            repeat: Infinity,
            callback: () => {
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

        this.dieIcon.setVisible(true);

        console.log(`Animal die ${this.title} ${this.lives}/${this.config?.count}`);
        if (this.lives <= 0) {
            this.totalAnimalDie();
        } else {
            this.scene.tweens.add({
                targets: this.dieIcon,
                alpha: 0,
                y: this.dieIcon.y - 100,
                duration: 5000,
            });
        }
    }

    private totalAnimalDie (): void {
        this.feedInterval?.destroy();
        this.pooInterval?.destroy();
        console.log(`Whole animal die ${this.title} ${this.lives}/${this.config?.count}`);
        this.hideAnimal();
        this.diePermaIcon.setVisible(true);
        this.scene.tweens.add({
            targets: this.diePermaIcon,
            alpha: 0,
            y: this.diePermaIcon.y - 100,
            duration: 5000,
        });
    }
}
