import AbstractMovableEntity from "entity/AbstractMovableEntity";
import GameScene from "scenes/GameScene";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import {CustomerStates} from "enums/CustomerStates";
import WorldEnvironment from "core/WorldEnvironment";
import Vector2 = Phaser.Math.Vector2;
import {Depths} from "enums/Depths";

export default class Customer extends AbstractMovableEntity {

    private static readonly WANDERING_AREA: Vector2[] = [
        new Vector2(272, 272),
        new Vector2(943, 464),
    ];

    private customerState: CustomerStates = CustomerStates.INIT;
    private wanderAttempt: number = 0;
    protected purchaseIcon!: Phaser.GameObjects.Image;

    constructor(scene: GameScene, x: number, y: number, pathfinding: MatrixWorld) {
        super(scene, x, y, pathfinding);
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
    }

    preUpdate(): void {
        super.preUpdate();

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
                }, this);
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
            }, this);
        }

        // at the purchase point
        if (this.customerState === CustomerStates.GOING_TO_PURCHASE && this.path.length === 0) {
            this.customerState = CustomerStates.WAIT_FOR_PURCHASE;
            this.purchaseIcon.setVisible(true);
            // Maximal time for wait for purchase
            setTimeout(() => {
                this.customerState = CustomerStates.LOOKIGN_FOR_LEAVE_TARGET;
                this.purchaseIcon.setVisible(false);
            }, Phaser.Math.RND.between(10000, 20000));
            console.log('waiting for purchase');
        }

        if (this.customerState === CustomerStates.LOOKIGN_FOR_LEAVE_TARGET) {
            this.customerState = CustomerStates.CALCULATING_LEAVING_PATH;
            this.pathfinding.findPath(this.x, this.y, WorldEnvironment.LEAVE_POSITION.x, WorldEnvironment.LEAVE_POSITION.y, (success, path) => {
                if (success) {
                    this.path = path;
                    this.customerState = CustomerStates.LEAVING;
                }
            }, this);
        }

        if (this.customerState === CustomerStates.LEAVING && this.path.length === 0) {
            this.customerState = CustomerStates.LEAVE_IN_PROGRESS;
            this.reachLeavePoint();
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
}
