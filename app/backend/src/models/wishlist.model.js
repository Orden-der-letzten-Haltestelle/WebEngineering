import DatabaseError from "../exceptions/DatabaseError";
import NotFoundError from "../exceptions/NotFoundError";
import WishlistItem from "../objects/items/WishlistItem";
import WishlistMember from "../objects/user/WishlistMember";
import { pool } from "./pool";
import Product from "../objects/items/Product.js"

/**
 * Finds a wishlistMember by userId and wishlistId
 * @param {int} userId 
 * @param {int} wishlistId
 * @returns {Promise<WishlistRoles[]>}
 * @throws {NotFoundError}
 */
async function findWishlistMemberByUserIdAndWishlistId(userId, wishlistId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                u.id,
                u.name,
                u.createdat,
                wr.id as wishlistroleid
            FROM webshop.users as u
                JOIN webshop.user_wishlist_relation as uwr ON uwr.userid = u.id
                JOIN webshop.wishlistroles as wr ON uwr.wishlistroleid = wr.id 
            WHERE 
                uwr.userid = $1 AND 
                uwr.wishlistid = $2;
            `, [userId, wishlistId]
        )

        if (result.rows.length <= 0) {
            throw new NotFoundError(`Wishlist with userId ${userId} and wishlistId ${wishlistId} doesn't exist`)
        }
        const rows = result.rows
        const roles = []
        rows.forEach((row) => {
            const role = Object.values(WishlistRoles).find(role => role.id === row.wishlistroleid);
            roles.append(role)
        })
        const wishlistMember = WishlistMember(
            rows[0].id,
            rows[0].name,
            rows[0].createdat,
            roles
        )
        return wishlistMember

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching Wishlist user with userId ${userId} and wishlistId ${wishlistId}`, error
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
            `, [id]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`WishlistItem with id ${id} doesn't exist`)
        }
        const row = result.rows[0]
        const product = Product(
            row.productid,
            row.name,
            row.description,
            row.storage,
            row.price
        )
        const wishlistItem = WishlistItem(
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
        throw new DatabaseError(
            `Failed fetching Wishlist user with userId ${userId} and wishlistId ${wishlistId}`, error
        )
    }
}

async function findWishlistsByUserId() {
    try {
`SELECT 
   	w.id,
	w.name,
	w.description,
	u.id as userid,
	u.name as username,
	u.email as email,
	uwr.id as user_wishlist_relation_id,
	wr.id as roleid
FROM webshop.wishlists as w 
JOIN webshop.user_wishlist_relation as uwr ON uwr.wishlistid = w.id
JOIN webshop.wishlistroles as wr ON uwr.wishlistroleid = wr.id
JOIN webshop.users as u ON u.id = uwr.userid
WHERE uwr.userid = 3; `
    } catch (error) {
        throw new DatabaseError(
            `Failed fetching Wishlists for user with id ${userId}`, error
        )
    }
}

export default {
    findWishlistMemberByUserIdAndWishlistId,
    findWishlistItemById
}