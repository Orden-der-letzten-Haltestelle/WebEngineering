import BasicUser from "./BasicUser.js"
export default class WishlistMember extends BasicUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Date} createdAt
     * @param {Array<WishlistRoles>} roles
     */
    constructor(id, name, email, createdAt, roles) {
        super(id, name, email, createdAt)
        this.roles = roles
    }

    /**
     * Check if the user has a given role or a role, that is higher then the required role
     * @param {WishlistRoles} requiredRole
     * @returns {boolean} - True if the user has the role, false otherwise.
     */
    hasRole(requiredRole) {
        return this.roles.some(
            (userRole) => userRole.level >= requiredRole.level
        )
    }
}
