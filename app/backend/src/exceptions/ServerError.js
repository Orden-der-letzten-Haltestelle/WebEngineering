import HttpError from "./HttpError.js"

export default class ServerError extends HttpError {
    constructor(message, options) {
        super(message, 500, options)
    }
}
