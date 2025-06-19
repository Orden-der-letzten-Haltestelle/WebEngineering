import Item from "./Item.js"

export default class CartItem extends Item {
    /**
     *
     * @param {int} id
     * @param {Product} product
     * @param {int} amount hierbei handelt es sich um die menge der Artikel, die der Nutzer im Einkaufswagen hat
     * @param {Date} addedAt
     * @param {int} ownerId
     */
    constructor(id, product, amount, addedAt, ownerId) {
        super(id, product, amount, addedAt)
        this.ownerId = ownerId
    }
}
