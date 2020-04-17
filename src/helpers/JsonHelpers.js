export default class JsonHelpers {

    /**
     * @param {string} inputString
     * @return {boolean}
     */
    static isJsonValid (inputString) {
        try {
            JSON.parse(inputString);
            return true;
        } catch (e) {
            return false;
        }
    }
}
