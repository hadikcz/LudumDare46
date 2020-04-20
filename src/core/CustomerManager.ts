import Group = Phaser.GameObjects.Group;
import GameScene from "scenes/GameScene";
import Customer from "entity/Customer";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import WorldEnvironment from "core/WorldEnvironment";
import NumberHelpers from "helpers/NumberHelpers";
import PlayerCharacter from "entity/PlayerCharacter";
import GameState from "core/GameState";

export default class CustomerManager {

    private static readonly MAX_CUSTOMER: number = 8;
    private static readonly ALLOWED_CHARACCTER_INDEXES: number[] = [1, 5];

    private scene: GameScene;
    private pathfinding: MatrixWorld;
    private customers: Group;
    private player: PlayerCharacter;
    private gameState: GameState;

    constructor(scene: GameScene, pathfiniding: MatrixWorld, player: PlayerCharacter, gameState: GameState) {
        this.scene = scene;
        this.pathfinding = pathfiniding;
        this.player = player;
        this.gameState = gameState;
        this.customers = this.scene.add.group();

        this.spawnCustomer();

        this.scene.time.addEvent({
            repeat: Infinity,
            delay: Phaser.Math.RND.between(5000, 15000),
            callbackScope: this,
            callback: () => {
                this.decideToSpawnCustomer();
            }
        });
    }

    private decideToSpawnCustomer (): void {
        if (Phaser.Math.RND.between(0, 5) === 5) {
            this.spawnCustomer();
        }
    }

    private spawnCustomer (): void {
        try {
            if (this.customers.getLength() >= CustomerManager.MAX_CUSTOMER) return;
            let characterIndex = NumberHelpers.randomIntInRange(CustomerManager.ALLOWED_CHARACCTER_INDEXES[0], CustomerManager.ALLOWED_CHARACCTER_INDEXES[1]);
            let customer = new Customer(this.scene, WorldEnvironment.LEAVE_POSITION.x, WorldEnvironment.LEAVE_POSITION.y, this.pathfinding, this.player, this.gameState, characterIndex);
            this.customers.add(customer);
        } catch (e) {
            console.log(e);
        }
    }
}
