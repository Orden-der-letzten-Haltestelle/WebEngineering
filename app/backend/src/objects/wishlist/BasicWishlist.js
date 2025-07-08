import WishlistMember from "../user/WishlistMember.js"

export default class BasicWishlist {

    /**
     * Wishlist with all basic information for the requesting user
     * @param {int} id 
     * @param {string} name 
     * @param {string} description 
     * @param {WishlistMember} member //The wishlistmember of the requesting user
     */
    constructor(id, name, description, member) {
        this.id = id
        this.name = name
        this.description = description
        this.member = member
    }
}
