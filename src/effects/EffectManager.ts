import FlyText from "effects/FlyText";
import GameScene from "scenes/GameScene";

export default class EffectManager {

    public static readonly DEFAULT_POSITION: number[] = [-10000, -10000];

    private scene: GameScene;

    private flyTextGroup: Phaser.GameObjects.Group;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.flyTextGroup = this.scene.add.group({
            classType: FlyText,
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

    private preparePools (): void {
        let group;

        group = this.flyTextGroup;
        for (let i = 0; i < group.maxSize; i++) {
            let effect = new FlyText(this.scene);
            group.add(effect);
        }
    }
}
