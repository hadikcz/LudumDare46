import GameScene from "scenes/GameScene";
import EventEmitter = Phaser.Events.EventEmitter;
import $ from 'jquery';
import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;

export default class Highlightable {

    public static readonly OVER: string = 'over';
    public static readonly OUT: string = 'out';
    public static readonly CLICK: string = 'click';

    public events: EventEmitter;
    protected highlight: Sprite | null = null;
    private scene: GameScene;
    private parent: Container;
    private title: string = '';
    private highlightText!: Text | null;

    constructor(scene: GameScene, parent: Container, title: string) {
        this.parent = parent;
        this.scene = scene;
        this.title = title;
        this.events = new EventEmitter();
    }

    setInteractiveAreaAndHighlight (imageIndex: string, x: number, y: number, hideAfterPointerOut: boolean = true, modifiyTextX: number = -15, modifyTextY: number = -45): void {
        this.highlight = this.scene.add.sprite(x, y, 'assets', imageIndex).setInteractive();
        this.parent.add(this.highlight);

        this.highlightText = this.scene.add.text(x + modifiyTextX, y + modifyTextY, this.title, { fontFamily: 'ARCADECLASSIC, Arial', fontSize: 65, color: '#feda09', align: 'center' }).setScale(0.2);
        this.highlightText.setStroke('#7c6e1b', 30).setVisible(false);
        this.parent.add(this.highlightText);

        if (hideAfterPointerOut) {
            this.highlight.setAlpha(0.00001);
        }

        this.highlight.setInteractive();

        this.highlight.on('pointerover', () => {
            this.highlight?.setAlpha(1);
            this.highlightText?.setVisible(true);
            $('#content').css('cursor', 'pointer');
            this.events.emit(Highlightable.OVER, this);
        });

        this.highlight.on('pointerout', () => {
            if (!hideAfterPointerOut) return;
            this.highlight?.setAlpha(0.00001);
            this.highlightText?.setVisible(false);
            $('#content').css('cursor', 'auto');
            this.events.emit(Highlightable.OUT, this);
        });

        this.highlight.on('pointerdown', () => {
            this.events.emit(Highlightable.CLICK, this.parent);
        });
    }

    destroy (fromScene?: boolean): void {
        this.highlight?.destroy(fromScene);
        this.highlightText?.destroy(fromScene);
    }
}
