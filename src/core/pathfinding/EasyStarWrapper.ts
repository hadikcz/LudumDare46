import easystarjs from 'easystarjs';
import Vector2 = Phaser.Math.Vector2;
import MatrixWorld from "core/pathfinding/MatrixWorld";
import WorldEnvironment from "core/WorldEnvironment";

export default class EasyStarWrapper {

    private static readonly ACCEPTABLE_TILES: number[] = [-1, 0];
    private easyStar;

    constructor () {
        this.easyStar = new easystarjs.js();
        this.easyStar.setAcceptableTiles(EasyStarWrapper.ACCEPTABLE_TILES);
        this.easyStar.enableSync();
        this.easyStar.enableDiagonals();
    }

    setGrid (data: integer[][]): void {
        this.easyStar.setGrid(data);
    }

    findPath (x1: number, y1: number, x2: number, y2: number, callback: FindPathCallback, callbackContext): void {
        let from = EasyStarWrapper.transformWorldToGridPosition(x1, y1, true);
        let to = EasyStarWrapper.transformWorldToGridPosition(x2, y2, true);
        this.easyStar.findPath(from.x, from.y, to.x, to.y, (path: Vector2[]) => {
            if (path) {
                let convertedPath = EasyStarWrapper.convertGridToWorldPoints(path);
                callback.call(callbackContext, true, convertedPath);
            } else {
                callback.call(callbackContext, false, []);
            }
        });
        this.easyStar.calculate();
    }

    private static convertGridToWorldPoints (points: Vector2[]): Vector2[] {
        let convertedPoints: Vector2[] = [];
        points.forEach((point) => {
            convertedPoints.push(EasyStarWrapper.transformGridToWorldPosition(point.x, point.y));
        });
        return convertedPoints;
    }

    private static transformGridToWorldPosition (x, y): Vector2 {
        return {
            x: x * MatrixWorld.TILE_SIZE + WorldEnvironment.ORIGIN_POINT.x,
            y: y * MatrixWorld.TILE_SIZE + WorldEnvironment.ORIGIN_POINT.y
        } as Vector2;
    }

    private static transformWorldToGridPosition (x: number, y: number, checkBounds: boolean = false): Vector2 {
        if (checkBounds) {
            if (x < 0) {
                x = MatrixWorld.TILE_SIZE * 2;
            } else if (x > MatrixWorld.getWorldSize[0]) {
                x = MatrixWorld.getWorldSize[0] - MatrixWorld.TILE_SIZE * 2;
            }
            if (y < 0) {
                y = MatrixWorld.TILE_SIZE * 2;
            } else if (y > MatrixWorld.getWorldSize[1]) {
                y = MatrixWorld.getWorldSize[1] - MatrixWorld.TILE_SIZE * 2;
            }
        }

        return {
            x: Math.floor(x / MatrixWorld.TILE_SIZE),
            y: Math.floor(y / MatrixWorld.TILE_SIZE)
        } as Vector2;
    }

}

interface FindPathCallback { (success: boolean, path: Vector2[]): void }
