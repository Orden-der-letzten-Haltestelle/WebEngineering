import HttpError from "./HttpError.js"

export default class TokenVerificationError extends HttpError {
    constructor(
        message = "Invalid or expired token",
        statusCode = 403,
        options
    ) {
        super(message, statusCode, options)
    }
}
