import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import WishlistItem from "../objects/items/WishlistItem.js"
import WishlistMember from "../objects/user/WishlistMember.js"
import BasicUser from "../objects/user/BasicUser.js"
import WishlistRoles from "../objects/user/WishlistRoles.js"
import { pool } from "./pool.js"
import Product from "../objects/items/Product.js"
import ServerError from "../exceptions/ServerError.js"
import Wishlist from "../objects/wishlist/Wishlist.js"
import BasicWishlist from "../objects/wishlist/BasicWishlist.js"

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
            `,
            [userId, wishlistId]
        )

        if (result.rows.length <= 0) {
            throw new NotFoundError(
                `Wishlist with userId ${userId} and wishlistId ${wishlistId} doesn't exist`
            )
        }
        const rows = result.rows
        const roles = []
        rows.forEach((row) => {
            const role = Object.values(WishlistRoles).find(
                (role) => role.id === row.wishlistroleid
            )
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
            `Failed fetching Wishlist user with userId ${userId} and wishlistId ${wishlistId}`,
            error
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
            `Failed fetching WishlistItem with id ${id}`,
            error
        )
    }
}

/**
 * Finds all Wishlist, the given user is member of.
 * @param {int} userId
 * @returns {Promise<BasicWishlist[]>}
 * @throws {ServerError}
 * @throws {DatabaseError}
 */
async function findWishlistsByUserId(userId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                w.id,
                w.name,
                w.description,
                u.id as userid,
                u.name as username,
                u.email as email,
                u.createdat,
                uwr.id as user_wishlist_relation_id,
                wr.id as roleid
            FROM webshop.wishlists as w 
                JOIN webshop.user_wishlist_relation as uwr ON uwr.wishlistid = w.id
                JOIN webshop.wishlistroles as wr ON uwr.wishlistroleid = wr.id
                JOIN webshop.users as u ON u.id = uwr.userid
            WHERE uwr.userid = $1
            ORDER BY w.id;
            `,
            [userId]
        )
        const rows = result.rows
        let lastWishlistId = undefined

        if (rows.length <= 0) {
            return []
        }
        console.log("here1")
        const basicUser = BasicUser(
            rows[0].userid,
            rows[0].username,
            rows[0].email,
            rows[0].createdat
        )
        console.log("here1")

        const wishlists = []
        rows.forEach((row) => {
            //only edit roles
            const role =
                Object.values(WishlistRoles).find(
                    (role) => role.id === row.roleid
                ) || null
            if (null) {
                throw new ServerError(
                    "set Wishlistroles in enum doesn't match the wishlistroles in DB."
                )
            }
            console.log("here2")
            if (lastWishlistId == undefined || lastWishlistId != row.id) {
                //add new wishlist
                lastWishlistId = row.id

                const wishlistMember = WishlistMember(
                    basicUser.id,
                    basicUser.name,
                    basicUser.email,
                    basicUser.createdat,
                    [role]
                )
                const newWishlist = BasicWishlist(
                    row.id,
                    row.name,
                    row.description,
                    wishlistMember
                )
                wishlists.append(newWishlist)
                console.log("here3")
            } else {
                //wishlist already in list, just add role
                wishlists[wishlists.length - 1].member.roles.append(role)
                console.log("here4")
            }
        })
    } catch (error) {
        console.error(error.stack)
        if (error instanceof ServerError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching Wishlists for user with id ${userId}`,
            error
        )
    }
}

export default {
    findWishlistMemberByUserIdAndWishlistId,
    findWishlistItemById,
    findWishlistsByUserId,
}
