import GameScene from 'scenes/GameScene';
import GameConfig from "config/GameConfig";
import Vector2 = Phaser.Math.Vector2;
import {Depths} from "enums/Depths";
import CashDesk from "core/CashDesk";
import Door from "core/Door";
import DoorEntrance from "core/DoorEntrance";
import PlayerCharacter from "entity/PlayerCharacter";

export default class WorldEnvironment {

    public static readonly ORIGIN_POINT: Vector2 = new Vector2(70, 100);
    public static readonly ORIGIN_POINT_INNER: Vector2 = new Vector2(50, 0);
    public static readonly SHELF_SECOND_ROW_DEPTH: number = 398;
    public static readonly PURCHASE_POSITION: Vector2 = new Vector2(222, 272);
    public static readonly LEAVE_POSITION: Vector2 = new Vector2(207, 481);
    public static readonly SPAWN_POSITION: Vector2 = new Vector2(207, 300);
    public static readonly DESK_MIN_Y: number = 250;

    private scene: GameScene;
    private player: PlayerCharacter;

    private fanInner!: Phaser.GameObjects.Image;

    constructor (scene: GameScene, player: PlayerCharacter) {
        this.scene = scene;
        this.player = player;
        this.scene.physics.world.setBounds(0, 0, GameConfig.World.size.width, GameConfig.World.size.height);
        this.scene.cameras.main.setBackgroundColor('#00');

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x, WorldEnvironment.ORIGIN_POINT.y, 'assets', 'game_wall').setOrigin(0, 0).setDepth(Depths.UNDER_PLAYER);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + 0, WorldEnvironment.ORIGIN_POINT.y + 130, 'assets', 'game_floor').setOrigin(0, 0).setDepth(Depths.UNDER_PLAYER);

        let cashDesk = new CashDesk(this.scene, WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 0, WorldEnvironment.ORIGIN_POINT.y + 155);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 26, WorldEnvironment.ORIGIN_POINT.y + 27, 'assets', 'game_wallpaper').setOrigin(0, 0).setDepth(Depths.UNDER_PLAYER);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 179, WorldEnvironment.ORIGIN_POINT.y + 30, 'assets', 'game_vent').setOrigin(0.5, 0.5).setDepth(Depths.UNDER_PLAYER);
        this.fanInner = this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 179, WorldEnvironment.ORIGIN_POINT.y + 30, 'assets', 'game_vent_inner').setOrigin(0.5, 0.5).setDepth(Depths.UNDER_PLAYER);

        let door = new Door(this.scene, WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 781, WorldEnvironment.ORIGIN_POINT.y + 136, this.player);

        this.scene.add.rectangle(WorldEnvironment.ORIGIN_POINT.x + 0, WorldEnvironment.ORIGIN_POINT.y + 131, 1000, 15, 0x000000, 0.35).setOrigin(0, 0.5).setDepth(Depths.UNDER_PLAYER);
        let entrance = new DoorEntrance(this.scene, WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 87, WorldEnvironment.ORIGIN_POINT.y + 389);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 90, WorldEnvironment.ORIGIN_POINT.y + 14, 'assets', 'game_light_left').setOrigin(0.5, 0).setDepth(Depths.CEILING_LAMPS_LIGHTS);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 385, WorldEnvironment.ORIGIN_POINT.y + 14, 'assets', 'game_light_left').setOrigin(0.5, 0).setDepth(Depths.CEILING_LAMPS_LIGHTS);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 720, WorldEnvironment.ORIGIN_POINT.y + 14, 'assets', 'game_light_left').setOrigin(0.5, 0).setDepth(Depths.CEILING_LAMPS_LIGHTS);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 109, WorldEnvironment.ORIGIN_POINT.y + 52, 'assets', 'game_ceiling_single').setOrigin(0.5, 1).setDepth(Depths.CEILING_LAMPS);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 413, WorldEnvironment.ORIGIN_POINT.y + 52, 'assets', 'game_ceiling_single').setOrigin(0.5, 1).setDepth(Depths.CEILING_LAMPS);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 743, WorldEnvironment.ORIGIN_POINT.y + 52, 'assets', 'game_ceiling_single').setOrigin(0.5, 1).setDepth(Depths.CEILING_LAMPS);
    }

    update (): void {
        this.fanInner.angle += 3;
    }
}
