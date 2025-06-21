export class ApiError extends Error {
    /**
     * Takes as res the full res object from the fetch request
     * @param {string} message
     * @param {int} status
     * @param {object} errorData
     */
    constructor(message, status, errorData) {
        super(message)
        this.status = status
        this.errorData = errorData
    }
}
