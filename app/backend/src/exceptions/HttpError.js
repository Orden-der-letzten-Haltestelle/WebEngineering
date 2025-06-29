export default class HttpError extends Error {
    constructor(message, statusCode, options = {}) {
        super(message, options)
        this.statusCode = statusCode

        if (options && options.originalError instanceof Error) {
            this.stack += `\nCaused by: ${options.originalError.stack}`
        }
    }
}
