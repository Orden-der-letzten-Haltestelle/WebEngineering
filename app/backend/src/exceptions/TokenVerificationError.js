import HttpError from "./HttpError.js"

export default class TokenVerificationError extends HttpError {
    constructor(
        message = "Invalid or expired token",
        options
    ) {
        super(message, 403, options)
    }
}
