import GameScene from 'scenes/GameScene';
import GameConfig from "config/GameConfig";
import Vector2 = Phaser.Math.Vector2;

export default class WorldEnvironment {

    public static readonly ORIGIN_POINT: Vector2 = new Vector2(70, 100);
    public static readonly ORIGIN_POINT_INNER: Vector2 = new Vector2(50, 0);
    private scene: GameScene;

    private fanInner!: Phaser.GameObjects.Image;

    constructor (scene: GameScene) {
        this.scene = scene;
        this.scene.physics.world.setBounds(0, 0, GameConfig.World.size.width, GameConfig.World.size.height);
        this.scene.cameras.main.setBackgroundColor('#00');

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x, WorldEnvironment.ORIGIN_POINT.y, 'assets', 'game_wall').setOrigin(0, 0);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + 0, WorldEnvironment.ORIGIN_POINT.y + 130, 'assets', 'game_floor').setOrigin(0, 0);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 0, WorldEnvironment.ORIGIN_POINT.y + 70, 'assets', 'game_prodejni_pult').setOrigin(0, 0);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 26, WorldEnvironment.ORIGIN_POINT.y + 27, 'assets', 'game_wallpaper').setOrigin(0, 0);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 179, WorldEnvironment.ORIGIN_POINT.y + 30, 'assets', 'game_vent').setOrigin(0.5, 0.5);
        this.fanInner = this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 179, WorldEnvironment.ORIGIN_POINT.y + 30, 'assets', 'game_vent_inner').setOrigin(0.5, 0.5);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 297, WorldEnvironment.ORIGIN_POINT.y + 144, 'assets', 'game_fishes_shelf').setOrigin(0, 1);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 417, WorldEnvironment.ORIGIN_POINT.y + 144, 'assets', 'game_bunny_shelf').setOrigin(0, 1);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 537, WorldEnvironment.ORIGIN_POINT.y + 144, 'assets', 'game_rat_shelf').setOrigin(0, 1);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 657, WorldEnvironment.ORIGIN_POINT.y + 144, 'assets', 'game_parrot_shelf').setOrigin(0, 1);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 781, WorldEnvironment.ORIGIN_POINT.y + 136, 'assets', 'game_door').setOrigin(0, 1);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 417, WorldEnvironment.ORIGIN_POINT.y + 322, 'assets', 'game_spider_shelf').setOrigin(0, 1);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 537, WorldEnvironment.ORIGIN_POINT.y + 322, 'assets', 'game_dog_shelf').setOrigin(0, 1);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 657, WorldEnvironment.ORIGIN_POINT.y + 322, 'assets', 'game_turtle_shelf').setOrigin(0, 1);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 87, WorldEnvironment.ORIGIN_POINT.y + 389, 'assets', 'game_door_entrance').setOrigin(0.5, 1).setAlpha(0.8);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 90, WorldEnvironment.ORIGIN_POINT.y + 14, 'assets', 'game_light_left').setOrigin(0.5, 0);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 385, WorldEnvironment.ORIGIN_POINT.y + 14, 'assets', 'game_light_left').setOrigin(0.5, 0);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 720, WorldEnvironment.ORIGIN_POINT.y + 14, 'assets', 'game_light_left').setOrigin(0.5, 0);

        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 109, WorldEnvironment.ORIGIN_POINT.y + 52, 'assets', 'game_ceiling_single').setOrigin(0.5, 1);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 413, WorldEnvironment.ORIGIN_POINT.y + 52, 'assets', 'game_ceiling_single').setOrigin(0.5, 1);
        this.scene.add.image(WorldEnvironment.ORIGIN_POINT.x + WorldEnvironment.ORIGIN_POINT_INNER.x + 743, WorldEnvironment.ORIGIN_POINT.y + 52, 'assets', 'game_ceiling_single').setOrigin(0.5, 1);
    }

    update (): void {
        this.fanInner.angle += 3;
    }
}
