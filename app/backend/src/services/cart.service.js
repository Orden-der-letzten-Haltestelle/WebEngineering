import CartModel from "../models/cart.model.js"

async function getCart(userId) {
    return CartModel.findCartItemsByUserId(userId)
}

export default {
    getCart,
}
