import HttpError from "./HttpError.js"

export default class AuthenticationError extends HttpError {
    constructor(
        message = "Invalid email or password",
        statusCode = 401,
        options
    ) {
        super(message, statusCode, options)
    }
}
