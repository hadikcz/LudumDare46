import 'phaser';
// import Stats from 'stats.js';
import GameConfig from 'config/GameConfig';
import BootScene from 'scenes/BootScene';
import GameScene from 'scenes/GameScene';

declare let __DEV__: any;
const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    roundPixels: true,
    autoRound: true,
    parent: 'content',
    width: GameConfig.PhaserBasicSettings.gameSize.width,
    height: GameConfig.PhaserBasicSettings.gameSize.height,
    backgroundColor: GameConfig.PhaserBasicSettings.backgroundColor,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    disableContextMenu: !__DEV__,
    antialias: false,
    scale: {
        // mode: Phaser.DOM.FILL,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [
        BootScene,
        GameScene
    ]
};
const game = new Phaser.Game(config);

// let stats = new Stats();
// document.body.appendChild(stats.dom);
//
// requestAnimationFrame(function loop () {
//     stats.update();
//     requestAnimationFrame(loop);
// });
