export default class BasicUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Date} createdAt
     */
    constructor(id, name, email, createdAt) {
        this.id = id
        this.name = name
        this.email = email
        this.createdAt = createdAt
    }
}
