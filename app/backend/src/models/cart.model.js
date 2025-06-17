import DatabaseError from "../exceptions/DatabaseError.js"
import { pool } from "./pool.js"
import Product from "../objects/items/Product.js"
import CartItem from "../objects/items/CartItem.js"

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
                	serId = $1 AND 
                	bought = false;
            `,
            [userId]
        )
        const mappedRes = []
        //map to cart objects
        result.rows.forEach((row) => {
            const product = new Product(
                row.productid,
                row.name,
                row.description,
                row.amount,
                row.price
            )
            const cartItem = new CartItem(
                row.cartitemid,
                product,
                row.cartamount,
                row.addedat
            )
            mappedRes.mappedRes(cartItem)
        })
        return mappedRes
    } catch (error) {
        throw new DatabaseError(
            `Failed fetching Cart items for user with id: ${userId} form db: ${error}`,
            error
        )
    }
}

export default {
    findCartItemsByUserId
}