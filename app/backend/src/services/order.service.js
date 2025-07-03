import DatabaseError from "../exceptions/DatabaseError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import CartModel from "../models/cart.model.js"
import OrderItem from "../objects/items/OrderItem";

/**
 * Returns an orderItem by its id
 * @param {int} id 
 * @returns {Promise<OrderItem>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function getOrderItem(id) {
    const orderItem = await CartModel.findOrderItemById(id)
    return orderItem
}

export default {
    getOrderItem
}