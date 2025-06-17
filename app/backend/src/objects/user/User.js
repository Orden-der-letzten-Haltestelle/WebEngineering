import BasicUser from "./BasicUser.js"

export default class User extends BasicUser {
    /**
     * @param {int} id
     * @param {string} name
     * @param {string} email
     * @param {Date} createdAt
     * @param {Array<OrderItem>} orderHistory
     * @param {Array<CartItem>} cart
     */
    constructor(
        id,
        name,
        email,
        createdAt,
        orderHistory,
        cart
    ) {
        super(id, name, email, createdAt)
        this.roles = roles
        this.orderHistory = orderHistory
        this.cart = cart
    }
}
