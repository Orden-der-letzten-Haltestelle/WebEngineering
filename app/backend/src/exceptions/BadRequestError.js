import HttpError from "./HttpError.js"

export default class BadRequestError extends HttpError {
    constructor(message, options) {
        super(message, 400, options)
    }
}
