import AuthUser from "./AuthUser.js"

export default class AdvancedAuthUser extends AuthUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Date} createdAt
     * @param {boolean} isVerified
     * @param {boolean} isBanned
     * @param {Roles[]} roles
     * @param {string} password
     */
    constructor(
        id,
        name,
        email,
        createdAt,
        isVerified,
        isBanned,
        roles,
        password
    ) {
        super(id, name, email, createdAt, isVerified, isBanned, roles)
        this.password = password
    }

    /**
     * Returns a authUser, with out password
     * @returns {AuthUser}
     */
    getAuthUser() {
        return new AuthUser(
            this.id,
            this.name,
            this.email,
            this.createdAt,
            this.roles,
            this.isVerified,
            this.isBanned
        )
    }
}
