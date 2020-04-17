export default class InterpolationHelpers {
    static shortAngleDist (a0, a1) {
        var max = Math.PI * 2;
        var da = (a1 - a0) % max;
        return 2 * da % max - da;
    }

    static angleLerp (a0, a1, t) {
        return a0 + InterpolationHelpers.shortAngleDist(a0, a1) * t;
    }
}
