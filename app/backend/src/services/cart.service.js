import CartModel from "../models/cart.model.js"
import CartItem from "../objects/items/CartItem.js"

/**
 * Returns all CartItems with bought == false, that the user has.
 *
 * @param {int} userId
 * @returns {Promise<CartItem[]>}
 */
async function getCart(userId) {
    const cartItems = await CartModel.findCartItemsByUserId(userId)
    return cartItems
}

export default {
    getCart,
}
