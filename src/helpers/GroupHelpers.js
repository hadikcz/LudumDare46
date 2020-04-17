import Phaser from 'phaser';

export default class GroupHelpers {
    /**
     * @param {Phaser.GameObjects.Group} group
     * @param {Phaser.Geom.Point} pos
     * @param {number} range
     * @return {boolean}
     */
    static canSpawnOnPosInGroup (group, pos, range) {
        var closest = GroupHelpers.getClosestTo(group, pos);
        if (!closest) {
            return true;
        }
        return (Phaser.Math.Distance.Between(closest.x, closest.y, pos.x, pos.y) > range);
    }

    /**
     * @param {Phaser.GameObjects.Group} group
     * @param {Phaser.GameObjects.GameObject} object
     * @param {function} callback
     * @param callbackContext
     * @return {*}
     */
    static getClosestTo (group, object, callback, callbackContext) {
        var distance = Number.MAX_VALUE;
        var tempDistance = 0;
        var result = null;

        for (var i = 0; i < group.getLength() - 1; i++) {
            if (typeof group.getChildren()[i] === 'undefined') continue;
            var child = group.getChildren()[i];

            tempDistance = Math.abs(Phaser.Math.Distance.Between(object.x, object.y, child.x, child.y));

            if (tempDistance < distance && (!callback || callback.call(callbackContext, child, tempDistance))) {
                distance = tempDistance;
                result = child;
            }
        }

        return result;
    }
}
