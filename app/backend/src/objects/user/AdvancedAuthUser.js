import AuthUser from "./AuthUser.js"

export default class AdvancedAuthUser extends AuthUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Roles[]} roles
     * @param {string} password
     */
    constructor(id, name, email, roles, password) {
        super(id, name, email, roles)
        this.password = password
    }
}
