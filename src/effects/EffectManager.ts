import FlyText from "effects/FlyText";
import GameScene from "scenes/GameScene";
import SadSmile from "effects/SadSmile";
import PermaDeath from "effects/PermaDeath";

export default class EffectManager {

    public static readonly DEFAULT_POSITION: number[] = [-10000, -10000];

    private scene: GameScene;

    private flyTextGroup: Phaser.GameObjects.Group;
    private badSmileGroup: Phaser.GameObjects.Group;
    private permaDeathGroup: Phaser.GameObjects.Group;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.flyTextGroup = this.scene.add.group({
            classType: FlyText,
            maxSize: 20,
            runChildUpdate: true
        });

        this.badSmileGroup = this.scene.add.group({
            classType: SadSmile,
            maxSize: 20,
            runChildUpdate: true
        });

        this.permaDeathGroup = this.scene.add.group({
            classType: PermaDeath,
            maxSize: 20,
            runChildUpdate: true
        });

        this.preparePools();
    }

    launchFlyText (x: number, y: number, text: string, style: object | any = null): FlyText {
        let group = this.flyTextGroup;
        /** @type {FlyText} */
        let effect = group.getFirstDead();
        if (!effect) {
            effect = new FlyText(this.scene);
            group.add(effect);
        }

        effect.launch(x, y, text, style);
        return effect;
    }

    launchSadSmile (x: number, y: number, y2Add: number): SadSmile {
        let group = this.badSmileGroup;
        /** @type {SadSmile} */
        let effect = group.getFirstDead();
        if (!effect) {
            effect = new SadSmile(this.scene);
            group.add(effect);
        }

        effect.launch(x, y, y2Add);
        return effect;
    }

    launchPermaDeath (x: number, y: number, y2Add: number): SadSmile {
        let group = this.permaDeathGroup;
        /** @type {PermaDeath} */
        let effect = group.getFirstDead();
        if (!effect) {
            effect = new PermaDeath(this.scene);
            group.add(effect);
        }

        effect.launch(x, y, y2Add);
        return effect;
    }

    private preparePools (): void {
        let group;

        group = this.flyTextGroup;
        for (let i = 0; i < group.maxSize; i++) {
            let effect = new FlyText(this.scene);
            group.add(effect);
        }

        group = this.badSmileGroup;
        for (let i = 0; i < group.maxSize; i++) {
            let effect = new SadSmile(this.scene);
            group.add(effect);
        }

        group = this.permaDeathGroup;
        for (let i = 0; i < group.maxSize; i++) {
            let effect = new PermaDeath(this.scene);
            group.add(effect);
        }
    }
}
