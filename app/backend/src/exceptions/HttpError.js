export default class HttpError extends Error {
    constructor(message, statusCode, options) {
        super(message, options);
        this.statusCode = statusCode;
    }
}