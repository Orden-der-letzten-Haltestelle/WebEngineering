import DatabaseError from "../exceptions/DatabaseError.js"
import { pool } from "./pool.js"
import Product from "../objects/items/Product.js"
import CartItem from "../objects/items/CartItem.js"
import OrderItem from "../objects/items/OrderItem.js"
import NotFoundError from "../exceptions/NotFoundError.js"

/**
 * Counts all cartItems, that the user has, that have bought=true
 * @param {int} userId
 * @returns {Promise<int>}
 * @throws {DatabaseError}
 */
async function countCartItemsByUserId(userId) {
    try {
        const result = await pool.query(
            `
                SELECT COUNT(*)
                FROM webshop.cartitems as c 
                WHERE 
                    c.userid = $1 AND 
                    c.bought = false;
            `,
            [userId]
        )
        return parseInt(result.rows[0].count, 10)
    } catch (error) {
        throw new DatabaseError(
            `Failed counting Cart items for user with id: ${userId} from db: ${error}`,
            error
        )
    }
}

/**
 * Returns a CartItem by the id and bought=false
 * when thats not true, an NotFoundError will be thrown.
 * @param {int} id 
 * @param {int} userId 
 * @returns 
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function findCartItemByIdAndBoughtFalse(id) {
    try {
        const result = await pool.query(
            `
            SELECT 
                    c.id as cartitemid, 
                    c.addedat, 
                    c.amount as cartamount, 
                    c.addedat,
                    c.userid,
                    p.id as productid, 
                    p.name, 
                    p.description, 
                    p.amount as storageAmount,
                    p.price
                FROM webshop.cartitems as c 
                    JOIN webshop.products as p ON p.id = c.productid
                WHERE 
                	c.id = $1 AND
                    c.bought = false
            `, [id]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`CartItem with id ${id} and bought=false doesn't exist `)
        }
        const row = result.rows[0]
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
            row.addedat,
            row.userid
        )
        return cartItem

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(`Failed findCartItemById And bought False ${id}; ${error}`, error)
    }
}

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
                    c.userid,
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
                row.addedat,
                row.userid
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


async function updateCartItemAmount(cartItemId, newAmount) {
    try {
        const result = await pool.query(`
            UPDATE 
                webshop.cartitems as c 
            SET 
                amount = $1 
            WHERE 
                c.id = $2;
            `, [newAmount, cartItemId])
    } catch (error) {
        throw new DatabaseError(
            `Failed on updateCartItemAmount of cartitem with id ${cartItemId}: ${error}`,
            error
        )
    }
}

export default {
    countCartItemsByUserId,
    findCartItemByIdAndBoughtFalse,
    findCartItemsByUserId,
    updateCartItemAmount,
    setCartItemsOnBoughtByUserId,
}
