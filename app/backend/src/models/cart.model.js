import DatabaseError from "../exceptions/DatabaseError.js"
import { pool } from "./pool.js"
import Product from "../objects/items/Product.js"
import CartItem from "../objects/items/CartItem.js"
import OrderItem from "../objects/items/OrderItem.js"

/**
 * Returns a list of all cartItems, that the user has, that are not already bought.
 *
 * @param {string} userId
 * @returns {Promise<CartItem[]>}
 * @throws {DatabaseError}
 */
async function findCartItemsByUserId(userId) {
    try {
        const result = await pool.query(
            `
                SELECT 
                    c.id as cartitemid, 
                    c.addedat, 
                    c.amount as cartamount, 
                    c.addedat,
                    p.id as productid, 
                    p.name, 
                    p.description, 
                    p.amount as storageAmount,
                    p.price
                FROM webshop.cartitems as c 
                    JOIN webshop.products as p ON p.id = c.productid
                WHERE 
                	c.userid = $1 AND 
                	c.bought = false;
            `,
            [userId]
        )
        //map to cart objects
        const mappedRes = []
        result.rows.forEach((row) => {
            const product = new Product(
                row.productid,
                row.name,
                row.description,
                row.storageamount,
                row.price
            )
            const cartItem = new CartItem(
                row.cartitemid,
                product,
                row.cartamount,
                row.addedat
            )
            mappedRes.push(cartItem)
        })
        return mappedRes
    } catch (error) {
        throw new DatabaseError(
            `Failed fetching Cart items for user with id: ${userId} form db: ${error}`,
            error
        )
    }
}

/**
 * Sets all cartitems of the given user on bought = true
 * and returns all new OrderItems
 * @param {int} userId
 * @returns {Promise<OrderItem[]>}
 * @throws {DatabaseError}
 */
async function setCartItemsOnBoughtByUserId(userId) {
    try {
        const result = await pool.query(
            `
                UPDATE 
                    webshop.cartitems as c 
                SET 
                    bought=true, 
                    boughtat = now()
                FROM webshop.products AS p
                WHERE 
                    userId = $1 AND 
	                bought = false AND
					p.id = c.productid
                RETURNING 
                    c.id as cartitemid, 
                    c.addedat, 
                    c.amount as cartamount,
					c.boughtat,
                    p.id as productid, 
                    p.name, 
                    p.description, 
                    p.amount as storageAmount,
                    p.price;
            `,
            [userId]
        )
        //map to orderItem objects
        const orderItems = []
        result.rows.forEach((row) => {
            const product = new Product(
                row.productid,
                row.name,
                row.description,
                row.storageamount,
                row.price
            )
            const cartItem = new OrderItem(
                row.cartitemid,
                product,
                row.cartamount,
                row.addedat,
                row.boughtat
            )
            orderItems.push(cartItem)
        })
        return orderItems
    } catch (error) {
        throw new DatabaseError(
            `Failed setting Cartitems of user with id ${userId} on bought: ${error}`,
            error
        )
    }
}

export default {
    findCartItemsByUserId,
    setCartItemsOnBoughtByUserId,
}
