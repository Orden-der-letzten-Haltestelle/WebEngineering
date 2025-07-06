import Item from "./Item.js"

export default class WishlistItem extends Item {
    /**
     *
     * @param {int} id
     * @param {Product} product
     * @param {int} amount
     * @param {Date} addedAt
     * @param {int} wishlistId
     */
    constructor(id, product, amount, addedAt, wishlistId) {
        super(id, product, amount, addedAt)
        this.wishlistId = wishlistId
    }
}
