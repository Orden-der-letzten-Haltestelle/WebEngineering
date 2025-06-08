import HttpError from "./HttpError.js"

export default class BadRequestError extends HttpError {
    constructor(message, statusCode = 400, options) {
        super(message, statusCode, options)
    }
}
