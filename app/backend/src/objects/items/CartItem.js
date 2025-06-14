import Item from "./Item"

export default class CartItem extends Item {
    /**
     *
     * @param {int} id
     * @param {Product} product
     * @param {int} amount hierbei handelt es sich um die menge der Artikel, die der Nutzer im Einkaufswagen hat
     * @param {Date} addedAt
     */
    constructor(id, product, amount, addedAt) {
        super(id, product, amount,addedAt)
    }
}
