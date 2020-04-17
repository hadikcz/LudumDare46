export default class ArrayHelpers {
    /**
     * @param {array} array1
     * @param {array} array2
     * @returns {array}
     */
    static arrayMerge (array1, array2) {
        let result = [];
        array1.forEach((element) => {
            // @ts-ignore
            result.push(element);
        });
        array2.forEach((element) => {
            // @ts-ignore
            result.push(element);
        });
        return result;
    }

    /**
     * @param {json} object
     * @return {array}
     */
    static averageArrayObject (object) {
        let result = [];
        for (let key in object) {
            // @ts-ignore
            result.push({ id: key, latency: ArrayHelpers.averageArray(object[key]) });
        }

        // @ts-ignore
        result.sort((a, b) => { return a.latency - b.latency; });
        return result;
    }

    static averageArray (array) {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum / array.length;
    }

    /**
     * @param {array} array
     * @returns {*}
     */
    static getRandomFromArray (array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * @param {object} object
     * @return {*}
     */
    static getRandomFromObjectValues (object) {
        let array = ArrayHelpers.objectValuesToArray(object);
        return ArrayHelpers.getRandomFromArray(array);
    }

    static objectValuesToArray (obj) {
        return Object.keys(obj).map(function (key) { return obj[key]; });
    }

    /**
     * @param {number} from
     * @param {number} to
     * @param {number} number
     * @return {boolean}
     */
    static isNumberInRange (from, to, number) {
        return number >= from && number <= to;
    }

    /**
     * @param {array} array
     * @param {*} value
     * @return {boolean}
     */
    static inArray (array, value) {
        return array.indexOf(value) !== -1;
    }

    /**
     * @param {object} object
     * @param {*} value
     * @return {boolean}
     */
    static inObjectValues (object, value) {
        let dataArray = [];
        for (let o in object) {
            // @ts-ignore
            dataArray.push(object[o]);
        }
        return ArrayHelpers.inArray(dataArray, value);
    }

    static inObjectValueDeep (object, value) {
        let array = [];
        // transform into array
        for (let o in object) {
            // @ts-ignore
            array.push(object[o]);
        }

        return array.find(function (item) {
            if (item === value) {
                return true;
            } else if (ArrayHelpers.isObject(item)) {
                return ArrayHelpers.inObjectValueDeep(item, value);
            }
        });
    }

    private static sortByOrder (a: any, b: any): number {
        if (a.order < b.order) {
            return -1;
        } else if (a.order > b.order) {
            return 1;
        } else {
            return 0;
        }
    }

    static isObject (item: any): boolean {
        return (typeof item === 'object' && !Array.isArray(item) && item !== null);
    }
}
