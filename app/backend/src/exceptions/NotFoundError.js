import HttpError from "./HttpError.js"

export default class NotFoundError extends HttpError {
    constructor(message, statusCode = 404, options) {
        super(message, statusCode, options)
    }
}
