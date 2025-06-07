import HttpError from "./HttpError.js"

export default class UnauthorizedError extends HttpError {
    constructor(
        message = "Unauthorized, no token is given, for secure endpoint",
        statusCode = 401,
        options
    ) {
        super(message, statusCode, options)
    }
}
