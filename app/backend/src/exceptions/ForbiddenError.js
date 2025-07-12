import HttpError from "./HttpError.js"

export default class ForbiddenError extends HttpError {
    constructor(
        message = "You are not allowed, to access this endpoint.",
        options
    ) {
        super(message, 403, options)
    }
}
