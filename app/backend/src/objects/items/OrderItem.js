import Item from "./Item"

export default class OrderItem extends Item {
    constructor(id, product, amount, addedAt, boughtAt) {
        super(id, product, amount, addedAt)
        this.boughtAt = boughtAt
    }
}