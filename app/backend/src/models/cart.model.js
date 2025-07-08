import DatabaseError from "../exceptions/DatabaseError.js"
import { pool } from "./pool.js"
import Product from "../objects/items/Product.js"
import CartItem from "../objects/items/CartItem.js"
import OrderItem from "../objects/items/OrderItem.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import ProductModel from "./product.model.js"

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
            { originalError: error }
        )
    }
}

/**
 * Returns a list of all OrderItems, that are owned by the given user
 * @param {int} userId
 * @returns {Promise<OrderItem[]>}
 * @throws {DatabaseError}
 */
async function findOrderItemsByUserId(userId) {
    try {
        const result = await pool.query(
            `
                SELECT 
                    c.id as cartitemid, 
                    c.addedat, 
                    c.amount as cartamount, 
                    c.addedat,
                    c.boughtat, 
                    p.id as productid, 
                    p.name, 
                    p.description, 
                    p.amount as storageAmount,
                    p.price
                FROM 
                    webshop.cartitems as c
                JOIN 
                    webshop.products as p ON p.id = c.productId
                WHERE 
                    c.userId = $1 AND 
                    c.bought = true;
            `,
            [userId]
        )

        //map result to OrderItem Objects
        const mappedOrderItems = []
        result.rows.forEach((row) => {
            const product = new Product(
                row.productid,
                row.name,
                row.description,
                row.storageamount,
                row.price
            )
            const orderItem = new OrderItem(
                row.cartitemid,
                product,
                row.cartamount,
                row.addedat,
                row.boughtat
            )
            mappedOrderItems.push(orderItem)
        })
        return mappedOrderItems
    } catch (error) {
        throw new DatabaseError(
            `Failed on findOrderItemsByUserId with userId ${userId} from db: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * Returns true or false, when an cartitem with the userId and productId already exist
 * @param {int} userId
 * @param {int} productId
 * @returns {Promise<CartItem>}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 */
async function findCartItemByUserIdAndProductId(userId, productId) {
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
                FROM 
                    webshop.cartitems as c
                    JOIN webshop.products as p ON p.id = c.productid
                WHERE 
                    c.userid = $1 AND 
                    c.bought = false AND
                    c.productid = $2;
            `,
            [userId, productId]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(
                `CartItem with userId ${userId} and productId ${productId} and bought=false doesn't exist`
            )
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
        throw new DatabaseError(
            `Failed on findByUserIdAndProductIdAndBoughtFalse with userId ${userId} and productId ${productId}: ${error}`,
            { originalError: error }
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
async function findCartItemById(id) {
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
            `,
            [id]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(
                `CartItem with id ${id} and bought=false doesn't exist `
            )
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
        throw new DatabaseError(
            `Failed findCartItemById And bought False ${id}; ${error}`,
            { originalError: error }
        )
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
            { originalError: error }
        )
    }
}

/**
 * Sets all cartitems of the given user on bought = true
 * and returns all new OrderItems
 * Takes a client object, to be able to rollback, bc. change storage amount is also required to full fill the purchase
 *
 * @param {Pool} client
 * @param {int} userId
 * @returns {Promise<OrderItem[]>}
 * @throws {DatabaseError}
 */
async function setCartItemsOnBoughtByUserIdWithClient(client, userId) {
    try {
        const result = await client.query(
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
            { originalError: error }
        )
    }
}

/**
 * Handels the full Purchase process, first updates the amount of all products in the cart.
 * And then sets all items in the cart on bought=true and returns all updated cartItems as OrderItems
 * @param {int} userId
 * @param {CartItem[]} items
 * @returns {Promise<OrderItem[]>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function completePurchase(userId, cart) {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        //update storage amount on all products
        await Promise.all(
            cart.map((cartItem) => {
                const newStorageAmount =
                    cartItem.product.amount - cartItem.amount
                return ProductModel.changeStorageAmountByIdWithClient(
                    client,
                    cartItem.product.id,
                    newStorageAmount
                )
            })
        )

        //set all cartItems on bought and return orderITems
        const orderItems = await setCartItemsOnBoughtByUserIdWithClient(
            client,
            userId
        )
        await client.query("COMMIT")
        return orderItems
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release
    }
}

/**
 * Updates the amount of an cartitem.
 * @param {int} cartItemId
 * @param {int} newAmount
 * @returns {Promise}
 * @throws {DatabaseError}
 */
async function updateCartItemAmount(cartItemId, newAmount) {
    try {
        const result = await pool.query(
            `
            UPDATE 
                webshop.cartitems as c 
            SET 
                amount = $1 
            WHERE 
                c.id = $2;
            `,
            [newAmount, cartItemId]
        )
    } catch (error) {
        throw new DatabaseError(
            `Failed on updateCartItemAmount of cartitem with id ${cartItemId}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * Creates a new CartItem object in the database.
 * @param {int} userId
 * @param {int} productId
 * @param {int} amount
 * @returns {Promise}
 * @throws {DatabaseError}
 */
async function createCartItem(userId, productId, amount) {
    try {
        await pool.query(
            `
            INSERT INTO 
                webshop.cartitems as c 
            (
                userid, 
                productid, 
                amount, 
                bought) 
            VALUES (
                $1, 
                $2, 
                $3, 
                false
            );
            `,
            [userId, productId, amount]
        )
    } catch (error) {
        throw new DatabaseError(`Failed on createCartItem: ${error}`, {
            originalError: error,
        })
    }
}

/**
 * Deletes an cartItem by its id
 * @param {int} id
 * @returns {Promise}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function deleteCartItemById(id) {
    try {
        const result = await pool.query(
            `
            DELETE FROM 
                webshop.cartitems as c
            WHERE
                c.id = $1
            RETURNING
                *
            `,
            [id]
        )
        if (result.rows.length === 0) {
            throw NotFoundError(`CartItem with id ${id} doesn't exist`)
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `
            Failed on deleteCartItemById for cartItem with id ${id}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * Deletes all CartItems in Database, that are owned by the user with the given id.
 * @param {int} userId
 * @throws {DatabaseError}
 */
async function deleteAllCartItemsByUserId(userId) {
    try {
        await pool.query(
            `
            DELETE FROM
                webshop.cartitems as c
            WHERE
                c.userid = $1
                AND c.bought = false
            `,
            [userId]
        )
        return
    } catch (error) {
        throw new DatabaseError(
            `Failed on deleteAllCartItemsByUserId with userId ${userId}: ${error}`,
            { originalError: error }
        )
    }
}

export default {
    countCartItemsByUserId,
    findOrderItemsByUserId,
    findCartItemByUserIdAndProductId,
    findCartItemById,
    findCartItemsByUserId,
    updateCartItemAmount,
    createCartItem,
    completePurchase,
    deleteCartItemById,
    deleteAllCartItemsByUserId,
}
