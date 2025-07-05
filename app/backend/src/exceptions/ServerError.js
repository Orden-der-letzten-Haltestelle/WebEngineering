import HttpError from "./HttpError.js"

export default class ServerError extends HttpError {
    constructor(message, statusCode = 500, options) {
        super(message, statusCode, options)
    }
}
