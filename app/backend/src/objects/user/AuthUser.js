import BasicUser from "./BasicUser.js"

export default class AuthUser extends BasicUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Roles[]} roles
     */
    constructor(id, name, email, roles) {
        super(id, name, email)
        this.roles = roles
    }
}
