import AbstractMovableEntity from "entity/AbstractMovableEntity";
import GameScene from "scenes/GameScene";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import {CustomerStates} from "enums/CustomerStates";
import WorldEnvironment from "core/WorldEnvironment";
import {Depths} from "enums/Depths";
import {Shelfs} from "enums/Shelfs";
import PlayerCharacter from "entity/PlayerCharacter";
import Vector2 = Phaser.Math.Vector2;
import Text = Phaser.GameObjects.Text;
import GameState from "core/GameState";
import animals from 'structs/animals.json';

export default class Customer extends AbstractMovableEntity {

    private static readonly WANDERING_AREA: Vector2[] = [
        new Vector2(272, 272),
        new Vector2(943, 464),
    ];

    private customerState: CustomerStates = CustomerStates.INIT;
    private wanderAttempt: number = 0;
    protected purchaseIcon!: Phaser.GameObjects.Image;
    private highlightText!: Text;
    private player: PlayerCharacter;
    private gameState: GameState;
    private leaveTimeout: number | null = null;

    private wantedItem: Shelfs | null = null;

    constructor(scene: GameScene, x: number, y: number, pathfinding: MatrixWorld, player: PlayerCharacter, gameState: GameState, characterIndex: number = 0) {
        super(scene, x, y, pathfinding, characterIndex);
        this.player = player;
        this.gameState = gameState;
        this.wanderAttempt = Phaser.Math.RND.between(1, 5);

        let yT = -36;
        this.purchaseIcon = this.scene.add.image(0, yT, 'assets', 'game_purchase')
            .setOrigin(0.5, 0.5)
            .setDepth(Depths.UI_ICONS)
            .setVisible(false)
            .setScale(0.25);
        this.add(this.purchaseIcon);

        this.scene.tweens.add({
            targets: [this.purchaseIcon],
            y: yT -15,
            duration: 500,
            yoyo: true,
            repeat: Infinity,
            ease: Phaser.Math.Easing.Bounce.In
        });

        this.highlightText = this.scene.add.text(0, 0, 'Spider', { fontFamily: 'ARCADECLASSIC, Arial', fontSize: 65, color: '#feda09', align: 'center' }).setScale(0.2).setDepth(Depths.UI);
        this.highlightText.setStroke('#7c6e1b', 30).setVisible(false);
    }

    preUpdate(): void {
        super.preUpdate();
        try {
            if (this.highlightText) {
                this.highlightText.setPosition(this.x - 25, this.y - 105);
            }


            if (this.customerState === CustomerStates.INIT) {
                // 50% chance to purchase imitiedlty or go and watch thing
                if (Phaser.Math.RND.between(0, 1)) {
                    this.customerState = CustomerStates.CALCULATING_WANDERING_TARGET;
                    let wanderingTarget = this.getRandomWanderPosition();
                    this.pathfinding.findPath(this.x, this.y, wanderingTarget.x, wanderingTarget.y, (success, path) => {
                        // wait before move to another wander target
                        setTimeout(() => {
                            if (success) {
                                this.wanderAttempt--;
                                this.path = path;
                                this.customerState = CustomerStates.MOVING_TO_WANDER_TARGETR;
                            }

                        }, Phaser.Math.RND.between(500, 3000));
                    }, true, this);
                }
            }

            if (this.customerState === CustomerStates.MOVING_TO_WANDER_TARGETR && this.path.length === 0) {
                console.log('on pos');
                if (this.wanderAttempt > 0) {
                    this.customerState = CustomerStates.INIT;
                    console.log('another wander');
                } else {
                    this.customerState = CustomerStates.LOOKIGN_FOR_PURCHASE_TARGET;
                }
            }

            if (this.customerState === CustomerStates.LOOKIGN_FOR_PURCHASE_TARGET) {
                this.customerState = CustomerStates.CALCULATING_PATH_TO_PURCHASE;
                this.pathfinding.findPath(this.x, this.y, WorldEnvironment.PURCHASE_POSITION.x, WorldEnvironment.PURCHASE_POSITION.y, (success, path) => {
                    if (success) {
                        this.path = path;
                        this.customerState = CustomerStates.GOING_TO_PURCHASE;
                    }
                }, true, this);
            }

            // at the purchase point
            if (this.customerState === CustomerStates.GOING_TO_PURCHASE && this.path.length === 0) {
                this.customerState = CustomerStates.WAIT_FOR_PURCHASE;
                this.purchaseIcon.setVisible(true);

                this.wantedItem = Shelfs.FISH;
                this.highlightText.setText(this.translateShelfIntoAnimal(this.wantedItem));
                this.highlightText.setVisible(true);

                // Maximal time for wait for purchase
                // @ts-ignore
                this.leaveTimeout = setTimeout(() => {
                    this.customerState = CustomerStates.LOOKIGN_FOR_LEAVE_TARGET;
                    this.purchaseIcon.setVisible(false);
                    this.highlightText.setVisible(false);
                }, Phaser.Math.RND.between(10000, 20000));
                console.log('waiting for purchase');
            }

            if (this.customerState === CustomerStates.WAIT_FOR_PURCHASE && this.canStartPurchaseProcess()) {
                if (this.leaveTimeout) {
                    clearTimeout(this.leaveTimeout);
                    this.leaveTimeout = null;
                }
                this.customerState = CustomerStates.PURCHASING;

                setTimeout(() => {
                    this.customerState = CustomerStates.LOOKIGN_FOR_LEAVE_TARGET;
                    let coins = this.getCoinsByAnimal();
                    this.gameState.addBalance(coins);
                    this.purchaseIcon.setVisible(false);
                    this.highlightText.setVisible(false);
                }, 2000);
            }

            if (this.customerState === CustomerStates.LOOKIGN_FOR_LEAVE_TARGET) {
                this.customerState = CustomerStates.CALCULATING_LEAVING_PATH;
                this.pathfinding.findPath(this.x, this.y, WorldEnvironment.LEAVE_POSITION.x, WorldEnvironment.LEAVE_POSITION.y, (success, path) => {
                    if (success) {
                        this.path = path;
                        this.customerState = CustomerStates.LEAVING;
                    }
                }, true, this);
            }

            if (this.customerState === CustomerStates.LEAVING && this.path.length === 0) {
                this.customerState = CustomerStates.LEAVE_IN_PROGRESS;
                this.reachLeavePoint();
            }

        } catch(e) {
            console.log(e);
        }
    }

    private reachLeavePoint (): void {
        console.log('reach leave entrance door');
        this.scene.add.tween({
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.destroy(true);
            }
        });
    }

    private getRandomWanderPosition (): Vector2 {
        return new Vector2(
            Phaser.Math.RND.between(Customer.WANDERING_AREA[0].x, Customer.WANDERING_AREA[1].x),
            Phaser.Math.RND.between(Customer.WANDERING_AREA[0].y, Customer.WANDERING_AREA[1].y),
        );
    }

    private canStartPurchaseProcess (): boolean {
        let playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        return this.player.y <= WorldEnvironment.DESK_MIN_Y && this.player.x >= 210 && this.player.y <= 288 && playerBody.velocity.x === 0 && playerBody.velocity.y === 0;
    }

    private translateShelfIntoAnimal (shelf: Shelfs): string {
        switch (shelf) {
            case Shelfs.DOG:
                return 'Dog';
            case Shelfs.BUNNY:
                return 'Bunny';
            case Shelfs.RAT:
                return 'Rat';
            case Shelfs.PARROT:
                return 'Parrot';
            case Shelfs.TURTLE:
                return 'Turtle';
            case Shelfs.SPIDER:
                return 'Spider';
            case Shelfs.FISH:
                return 'Fish';
            case Shelfs.EMPTY:
                return 'Unknown';
            default:
                return 'Unknown';
        }
    }

    private getCoinsByAnimal (): number {
        if (!this.wantedItem) return 0;
        let lowered = this.translateShelfIntoAnimal(this.wantedItem).toLowerCase();
        return Phaser.Math.RND.integerInRange(animals[lowered].reward[0], animals[lowered].reward[1]);
    }

    destroy(fromScene?: boolean): void {
        super.destroy(fromScene);
        this.highlightText.destroy(true);
    }
}
