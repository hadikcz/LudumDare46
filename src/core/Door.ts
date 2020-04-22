import GameScene from "scenes/GameScene";
import Highlightable from "core/Highlightable";
import {Depths} from "enums/Depths";
import PlayerCharacter from "entity/PlayerCharacter";
import Text = Phaser.GameObjects.Text;
import ArrayHelpers from "helpers/ArrayHelpers";

declare let window: any;

export default class Door extends Phaser.GameObjects.Container {

    private static readonly BOSS_NOTES: string[] = [
        'Go back working,\n your shift is not ended yet!',
        'If you will not \nreturn to shop in 10 seconds,\nI will call your mom!',
        'Blyat!! I am waiting!',
        'knock, knock... \nWho is there ? Your salary\nmoron if you want to see it,\ngo back work!',
        'Last chance, my \npatient is over!!!',
        '"..shotgun reloading\nsound.." I am coming for you,\nyou peace of shit!',
    ];

    private static readonly BOSS_DIE_NOTES: string[] = [
        'Another animal died,\n are you crazy or what',
        'My favorite animal\n died, I will kill you!',
        'Of course, you just\n want keep it dead, of course!',
    ];

    private notesIterate: number = 0;
    private highlight: Highlightable;
    private player: PlayerCharacter
    private registerOpenShop: boolean = false;
    private bossText: Text;

    constructor(scene: GameScene, x: number, y: number, player: PlayerCharacter) {
        super(scene, x, y, []);
        this.player = player;
        this.scene.add.existing(this);

        this.setDepth(Depths.UNDER_PLAYER);

        let image = this.scene.add.image(0, 0, 'assets', 'game_door')
            .setOrigin(0, 1);
        this.add(image);

        this.highlight = new Highlightable(scene, this, 'Animal shop');

        this.highlight.setInteractiveAreaAndHighlight('game_door_highlight', 30, -50, true, -38, -70);

        this.highlight.events.on('Highlightable.CLICK', () => {
            console.log('register click');
            this.registerOpenShop = true;
        });

        this.bossText = this.scene.add.text(this.x - 100, this.y -160, 'BOSS: Go back working,\n your shift is not ended yet!', { fontFamily: 'arcadeclassic, Arial', fontSize: 80, color: '#000000', align: 'center', lineSpacing: -10 }).setScale(0.2).setAlpha(0);
        this.bossText.setStroke('#ffffff', 80);
        this.bossText.setLineSpacing(1);
        this.bossText.setDepth(Depths.UI);
    }

    flashBossText (animalDie: boolean = false): void {
        if (this.bossText.alpha > 0) return;
        let text = '';
        if (animalDie) {
            text = ArrayHelpers.getRandomFromArray(Door.BOSS_DIE_NOTES);
        } else {
            if (this.notesIterate >= Door.BOSS_NOTES.length) {
                text = ArrayHelpers.getRandomFromArray(Door.BOSS_NOTES);
            } else {
                text = Door.BOSS_NOTES[this.notesIterate++];
            }
        }

        this.bossText.setText('BOSS: ' + text);
        this.scene.add.tween({
            targets: this.bossText,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                setTimeout(() => {
                    this.scene.add.tween({
                        targets: this.bossText,
                        alpha: 0,
                        duration: 500
                    });
                }, 6500);
            }
        });
    }

    preUpdate (): void {
        if (this.registerOpenShop && Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) < 25) {
            this.scene.events.emit('openshop');
            console.log('open shop');
            this.registerOpenShop = false;
        }
    }
}
