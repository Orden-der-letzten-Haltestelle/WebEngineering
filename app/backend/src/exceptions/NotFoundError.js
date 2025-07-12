import HttpError from "./HttpError.js"

export default class NotFoundError extends HttpError {
    constructor(message, options) {
        super(message, 404, options)
    }
}
