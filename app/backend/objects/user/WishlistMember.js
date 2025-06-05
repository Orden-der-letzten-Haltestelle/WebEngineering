class WishlistMember extends BasicUser {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {int} userWishlistRelationId
     * @param {Array<WishlistRoles>} roles
     */
    constructor(
        id,
        name,
        email,
        userWishlistRelationId,
        roles
    ) {
        super(id, name, email)
        this.userWishlistRelationId = userWishlistRelationId
        this.roles = roles
    }
}
