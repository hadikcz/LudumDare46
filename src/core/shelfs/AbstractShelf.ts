import GameScene from "scenes/GameScene";
import {ShelfState} from "enums/ShelfState";
import Image = Phaser.GameObjects.Image;
import {Shelfs} from "enums/Shelfs";
import {Depths} from "enums/Depths";
import WorldEnvironment from "core/WorldEnvironment";
import Sprite = Phaser.GameObjects.Sprite;
import $ from 'jquery';

export default abstract class AbstractShelf extends Phaser.GameObjects.Container {

    protected scene: GameScene;
    protected shelfType: Shelfs;
    protected lives: number = 10;
    protected shelfState: ShelfState = ShelfState.OK;
    protected shelfImage: Image;
    protected animalImage: Image;
    protected animalImage2!: Image;
    protected cage!: Image;
    protected highlight: Sprite | null = null;

    protected title: string;

    constructor(scene: GameScene, x: number, y: number, shelfType: Shelfs, title: string = 'Unknown') {
        super(scene, x, y, []);
        this.scene = scene;
        this.shelfType = shelfType;
        this.title = title;

        this.scene.add.existing(this);
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
    }

    hideAnimal (): void {
        this.animalImage.setVisible(false);
        this.animalImage2?.setVisible(false);
    }

    showAnimal (): void {
        this.animalImage.setVisible(true);
        this.animalImage2?.setVisible(true);
    }

    protected setInteractiveAreaAndHighlight (imageIndex: string, x: number, y: number, hideAfterPointerOut: boolean = true): void {
        this.highlight = this.scene.add.sprite(x, y, 'assets', imageIndex).setInteractive();
        this.add(this.highlight);

        if (hideAfterPointerOut) {
            this.highlight.setAlpha(0.00001);
        }

        this.highlight.setInteractive();

        this.highlight.on('pointerover', () => {
            this.highlight?.setAlpha(1);
            $('#content').css('cursor', 'pointer');
        });

        this.highlight.on('pointerout', () => {
            if (!hideAfterPointerOut) return;
            this.highlight?.setAlpha(0.00001);

            $('#content').css('cursor', 'auto');
        });

    }
}
