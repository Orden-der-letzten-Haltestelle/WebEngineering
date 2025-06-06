export default class HttpError extends Error {
    constructor(message, statusCode = 500, options) {
        super(message, options);
        this.statusCode = statusCode;
    }
}