class Wishlist extends BasicWishlist {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} description
     * @param {Array<WishlistMember>} members
     * @param {Array<WishlistItem>} wishlistItems
     */
    constructor(id, name, description, members, wishlistItems) {
        this.id = id
        this.name = name
        this.description = description
        this.members = members
        this.wishlistItems = wishlistItems
    }
}
