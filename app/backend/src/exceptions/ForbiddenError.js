import HttpError from "./HttpError.js"

export default class ForbiddenError extends HttpError {
    constructor(
        message = "You are not allowed, to access this endpoint.",
        statusCode = 403,
        options
    ) {
        super(message, statusCode, options)
    }
}
