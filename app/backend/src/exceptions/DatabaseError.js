import HttpError from "./HttpError.js"

export default class DatabaseError extends HttpError {
    constructor(message, options) {
        super(message, 500, options)
    }
}
