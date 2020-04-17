import Phaser from 'phaser';
import GameScene from "scenes/GameScene";

export default class TestEntity extends Phaser.GameObjects.Container implements Phaser.GameObjects.GameObject {

    public scene!: GameScene;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);
        this.scene.add.existing(this);

        let image = this.scene.add.image(0, 0, 'mobPlaceholder');
        this.add(image);
    }
}
