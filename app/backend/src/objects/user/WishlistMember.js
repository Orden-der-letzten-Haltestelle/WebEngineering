import BasicUser from "./BasicUser"
export default class WishlistMember extends BasicUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Date} createdAt
     * @param {int} userWishlistRelationId
     * @param {Array<WishlistRoles>} roles
     */
    constructor(id, name, email, createdAt, userWishlistRelationId, roles) {
        super(id, name, email, createdAt)
        this.userWishlistRelationId = userWishlistRelationId
        this.roles = roles
    }
}
