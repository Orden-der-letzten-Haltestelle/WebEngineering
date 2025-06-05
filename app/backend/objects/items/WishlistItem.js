import Item from "./Item"

export default class WishlistItem extends Item {
    /**
     *
     * @param {int} id
     * @param {Product} product
     * @param {int} amount
     * @param {Date} addedAt
     */
    constructor(id, product, amount, addedAt) {
        super(id, product, amount, addedAt)
    }
}
