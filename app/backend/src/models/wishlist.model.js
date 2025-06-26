import DatabaseError from "../exceptions/DatabaseError";
import NotFoundError from "../exceptions/NotFoundError";
import WishlistMember from "../objects/user/WishlistMember";
import { pool } from "./pool";

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
                wrs.id as userwishlistrelationid,
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
            roles.append()
        })
        const wishlistMember = WishlistMember(
            rows[0].id,
            rows[0].name,
            rows[0].createdat,
            rows[0].userwishlistrelationid,
        )

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching Wishlist user with userId ${userId} and wishlistId ${wishlistId}`, error
        )
    }
}