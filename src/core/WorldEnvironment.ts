import GameScene from 'scenes/GameScene';
import GameConfig from "config/GameConfig";

export default class WorldEnvironment {

    private scene: GameScene;

    constructor (scene: GameScene) {
        this.scene = scene;
        this.scene.physics.world.setBounds(0, 0, GameConfig.World.size.width, GameConfig.World.size.height);
    }
}
