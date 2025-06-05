export default class DatabaseError extends Error {
    constructor(message, options = {}) {
        super(message)
        this.name = "DatabaseError"
        this.statusCode = options.statusCode || 500
        this.cause = options.cause
        Error.captureStackTrace(this, this.constructor)
    }
}
