import BasicWishlist from "./BasicWishlist.js"

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

    /**
     * Find a WishlistMember in members by id.
     * @param {int} userId - The userId of the WishlistMember to find.
     * @returns {WishlistMember|null} - The WishlistMember found, or null if not found.
     */
    findMemberByUserId(userId) {
        return this.members.find((member) => member.id === userId) || null
    }
}
