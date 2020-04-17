export default class UrlHelpers {
    static getQueryParam (paramName: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }
}
