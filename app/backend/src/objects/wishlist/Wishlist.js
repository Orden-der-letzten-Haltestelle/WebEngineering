import BasicWishlist from "./BasicWishlist"

export default class Wishlist extends BasicWishlist {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} description
     * @param {WishlistMember} member //only the requesting member
     * @param {Array<WishlistMember>} members //all members
     * @param {Array<WishlistItem>} wishlistItems
     */
    constructor(id, name, description, member, members, wishlistItems) {
        super(id, name, description, member)
        this.members = members
        this.wishlistItems = wishlistItems
    }
}
