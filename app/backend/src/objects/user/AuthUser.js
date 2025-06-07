import BasicUser from "./BasicUser.js"

export default class AuthUser extends BasicUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {Roles[]} roles
     */
    constructor(id, name, email, password, roles) {
        super(id, name, email)
        this.password = password
        this.roles = roles
    }
}
