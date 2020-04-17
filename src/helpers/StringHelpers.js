export default class StringHelpers {
    /**
     * @param {string} string
     * @return {string}
     */
    static capitalize (string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    /**
     * @param {string} string
     * @param {number} length
     * @return {string}
     */
    static cutString (string, length) {
        if (string === undefined) return '';

        return string.substr(0, length);
    }

    /**
     * @param {string} string
     * @param {number} length
     * @return {string}
     */
    static getFirstNameAndCut (string, length) {
        if (string === undefined) return '';

        let parts = string.split(' ');
        return StringHelpers.cutString(parts[0], length);
    }

    /**
     * @param {string} target
     * @param {string} search
     * @param {string} replacement
     * @return {string}
     */
    static replaceAll (target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    }
}
