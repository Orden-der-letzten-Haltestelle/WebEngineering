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
        this.isVerified = isVerified
        this.isBanned = isBanned
        this.roles = roles
    }

    /**
     * Check if the user has a given role or a role, that is higher then the required role
     * @param {Roles} requiredRole
     * @returns {boolean} - True if the user has the role, false otherwise.
     */
    hasRole(requiredRole) {
        return this.roles.some(
            (userRole) => {
                return userRole.level >= requiredRole.level
            }
        )
    }
}
