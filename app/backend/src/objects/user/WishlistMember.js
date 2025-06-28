import BasicUser from "./BasicUser"
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
     * Check if the user has a given role.
     * @param {WishlistRoles} role 
     * @returns {boolean} - True if the user has the role, false otherwise.
     */
    hasRole(role) {
        return this.roles.some(userRole => userRole.id === role.id);
    }
}
