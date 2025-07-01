import { pool } from "./pool.js"

//objects
import WishlistItem from "../objects/items/WishlistItem.js"
import Product from "../objects/items/Product.js"

//erros
import NotFoundError from "../exceptions/NotFoundError.js"
import DatabaseError from "../exceptions/DatabaseError.js"

/**
 * retruns a wishlistItem, by productId and wishlistId
 * 
 * @param {int} productId 
 * @param {int} wishlistId 
 * @returns {Promise<WishlistItem>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function findByProductIdAndWishlistId(productId, wishlistId) {
    try {
        const result = await pool.query(`
            SELECT
	            wi.id,
	            wi.amount,
	            wi.addedat,
	            wi.wishlistid,
	            p.id as productid,
	            p.name,
	            p.description,
	            p.amount as storage,
	            p.price
            FROM 
                webshop.wishlistitems as wi
            JOIN 
                webshop.products as p ON p.id = wi.productid
            WHERE 
                wi.productid = $1 AND 
                wishlistid = $2;`,
            [productId, wishlistId])


        if (result?.rows?.length <= 0) {
            throw new NotFoundError(`WishlistItem with the productId ${productId} and the wishlistId ${wishlistId} doesnt exist.`)
        }

        const row = result.rows[0]
        const product = new Product(row.productid, row.name, row.description, row.storage, row.price)
        const wishlistItem = new WishlistItem(row.id, product, row.amount, row.addedat, row.wishlistid)
        return wishlistItem
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching WishlistItem with wishlistId ${wishlistId} and productId ${productId}`,
            { originalError: error }
        )
    }
}


/**
 * Finds an wishlistItem by its id
 * @param {int} id
 * @returns {Promise<WishlistItem>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function findWishlistItemById(id) {
    try {
        const result = await pool.query(
            `
            SELECT 
                wi.id,
                wi.amount,
                wi.addedat,
                wi.wishlistid,
                p.id as productid,
                p.name,
                p.description,
                p.amount as storage,
                p.price as price
            FROM webshop.wishlistitems as wi
                JOIN webshop.products as p ON p.id = wi.productid 
            WHERE wi.id = $1;
            `,
            [id]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`WishlistItem with id ${id} doesn't exist`)
        }
        const row = result.rows[0]
        const product = new Product(
            row.productid,
            row.name,
            row.description,
            row.storage,
            row.price
        )
        const wishlistItem = new WishlistItem(
            row.id,
            product,
            row.amount,
            row.addedat,
            row.wishlistid
        )
        return wishlistItem
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(`Failed fetching WishlistItem with id ${id}`, {
            originalError: error,
        })
    }
}


/**
 * Finds all wishlistItems that in the given wishlist
 * @param {int} wishlistId
 * @returns {Promise<WishlistItem[]>}
 * @throws {DatabaseError}
 */
async function findWishlistItemsByWishlistId(wishlistId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                p.id as productid,
                p.name,
                p.description,
                p.amount as storage,
                p.price,
                wi.amount,
                wi.addedat,
                wi.id as wishlist_item_id
            FROM 
                webshop.wishlistitems as wi
            JOIN 
                webshop.products as p ON p.id = wi.productid
            WHERE 
                wi.wishlistid = $1;
            `,
            [wishlistId]
        )

        const rows = result.rows
        const wishlistItems = []
        rows.forEach((row) => {
            const product = new Product(
                row.productid,
                row.name,
                row.description,
                row.storage,
                row.price
            )
            const wishlistItem = new WishlistItem(
                row.wishlist_item_id,
                product,
                row.amount,
                row.addedat,
                wishlistId
            )
            wishlistItems.push(wishlistItem)
        })
        return wishlistItems
    } catch (error) {
        throw new DatabaseError(`Failed fetching WishlistItem with id ${id}`, {
            originalError: error,
        })
    }
}

/**
 * Adds a new wishlistitme to the wishlist
 * @param {int} wishlistId 
 * @param {int} productId 
 * @returns {Promise}
 * @throws {DatabaseError}
 */
async function createWishlistItem(wishlistId, productId, amount) {
    try {
        const result = pool.query(`
            INSERT INTO webshop.wishlistitems 
                (wishlistid, productid, amount)
            VALUES
                ($1, $2, $3)
            RETURNING *;
            `, [wishlistId, productId, amount])
        if (result.length <= 0) {
            throw new DatabaseError("Failed creating item in DB")
        }
        return
    } catch (error) {
        throw new DatabaseError(
            `Failed creating new wishlistItem in DB: ${error.message}`,
            { originalError: error }
        )

    }
}

export default {
    findWishlistItemById,
    findByProductIdAndWishlistId,
    findWishlistItemsByWishlistId,
    createWishlistItem,
}