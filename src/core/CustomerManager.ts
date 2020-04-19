import Group = Phaser.GameObjects.Group;
import GameScene from "scenes/GameScene";
import Customer from "entity/Customer";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import WorldEnvironment from "core/WorldEnvironment";

export default class CustomerManager {

    private static readonly MAX_CUSTOMER: number = 8;

    private scene: GameScene;
    private pathfinding: MatrixWorld;
    private customers: Group;

    constructor(scene: GameScene, pathfiniding: MatrixWorld) {
        this.scene = scene;
        this.pathfinding = pathfiniding;
        this.customers = this.scene.add.group();

        this.spawnCustomer();

        setTimeout(() => {
            this.decideToSpawnCustomer();
        }, Phaser.Math.RND.between(5000, 15000));
    }

    private decideToSpawnCustomer (): void {
        if (Phaser.Math.RND.between(0, 5) === 5) {
            this.spawnCustomer();
        }

        setTimeout(() => {
            this.decideToSpawnCustomer();
        }, Phaser.Math.RND.between(5000, 15000));
    }

    private spawnCustomer (): void {
        if (this.customers.getLength() >= CustomerManager.MAX_CUSTOMER) return;
        let customer = new Customer(this.scene, WorldEnvironment.LEAVE_POSITION.x, WorldEnvironment.LEAVE_POSITION.y, this.pathfinding);
        this.customers.add(customer);
    }
}
