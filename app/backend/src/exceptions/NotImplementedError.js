import HttpError from "./HttpError.js";

export default class NotImplementedError extends HttpError {
    constructor(message, options) {
        super(message, 501, options)
    }
}