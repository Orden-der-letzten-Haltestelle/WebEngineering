import BasicUser from "./BasicUser.js"

export default class AuthUser extends BasicUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Date} createdAt
     * @param {boolean} isVerified
     * @param {boolean} isBanned
     * @param {Roles[]} roles
     */
    constructor(id, name, email, createdAt, isVerified, isBanned, roles) {
        super(id, name, email, createdAt)
        this.roles = roles
        this.isVerified = isVerified
        this.isBanned = isBanned
    }
}
