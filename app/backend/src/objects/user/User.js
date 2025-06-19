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
        super(id, name, email)
        this.roles = roles
        this.isBanned = isBanned
        this.isVerified = isVerified
        this.createdAt = createdAt
        this.orderHistory = orderHistory
        this.cart = cart
    }
}
