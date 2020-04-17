export default class NumberHelpers {
    /**
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    static randomIntInRange (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    static randomFloatInRange (min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * @param {number} number
     * @param {string} separator
     * @return {string}
     */
    static formatThousands (number, separator = ' ') {
        number = String(number);

        while (number.length % 3) {
            number = '#' + number;
        }

        var result = number.substr(0, 3);
        result = result.replace(/#/g, '');
        var i;
        var length = number.length;
        for (i = 3; i < length; i += 3) {
            result = result + separator + number.substr(i, 3);
        }

        return result;
    }
}
