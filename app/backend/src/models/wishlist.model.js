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
import Roles from "../objects/user/Roles.js"









/**
 * retruns a wishlistItem, by productId and wishlistId
 */
async function findByProductIdAndWishlistId(productId, wishlistId) {
    try{
        //TODO implement
    }catch(error){
        
    }
}


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
                u.email,
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
            roles.push(role)
        })
        const wishlistMember = new WishlistMember(
            rows[0].id,
            rows[0].name,
            rows[0].email,
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
 * Finds a BasicWishlistByWishlistId with out the member
 * @param {int} wishlistId
 */
async function findBasicWishlistByWishlistId(wishlistId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                w.id,
                w.name,
                w.description
            FROM 
                webshop.wishlists as w
            WHERE 
                w.id = $1;
            `,
            [wishlistId]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(
                `Wishlist with id ${wishlistId} doesn't exist`
            )
        }
        const row = result.rows[0]
        const basicWishlist = new BasicWishlist(
            row.id,
            row.name,
            row.description,
            undefined
        )
        return basicWishlist
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
 * Finds all WishlistMembers, of the given wishlist.
 * @param {int} wishlistId
 * @returns {Promise<WishlistMember[]>}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 */
async function findWishlistMembersByWishlistId(wishlistId) {
    try {
        const result = await pool.query(
            `
        SELECT 
            u.id as userid,
            u.name as username,
            u.email,
            u.createdat,
            uwr.wishlistroleid as roleid
        FROM 
            webshop.user_wishlist_relation as uwr
        JOIN 
            webshop.users as u ON u.id = uwr.userid
        WHERE 
            uwr.wishlistid = $1;
        `,
            [wishlistId]
        )
        const rows = result.rows
        if (rows.length <= 0) {
            throw new NotFoundError(
                `Wishlist with id ${wishlistId} doesn't exist.`
            )
        }

        //extract members
        const wishlistMembers = []
        let lastUserId = undefined
        console.log(rows)
        rows.forEach((row) => {
            //extract role
            const role =
                Object.values(WishlistRoles).find(
                    (role) => role.id === row.roleid
                ) || null
            if (null) {
                throw new ServerError(
                    "set Wishlistroles in enum doesn't match the wishlistroles in DB."
                )
            }
            //add members
            if (
                lastUserId == undefined ||
                wishlistMembers.length <= 0 ||
                lastUserId != row.userid
            ) {
                //add new wishlistMembers
                lastUserId = row.userid
                const wishlistMember = new WishlistMember(
                    row.userid,
                    row.username,
                    row.email,
                    row.createdat,
                    [role]
                )
                wishlistMembers.push(wishlistMember)
            } else {
                //only add role to last wishlist member
                wishlistMembers[wishlistMembers.length - 1].roles.push(role)
            }
        })
        return wishlistMembers
    } catch (error) {
        if (error instanceof ServerError || error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching Wishlists for user with id ${userId}`,
            { originalError: error }
        )
    }
}

/**
 * Returns the wishlistMember with the given userId, for the wishlist with the given id
 * @param {int} wishlistId
 * @param {int} userId
 * @returns {Promise<wishlistMember>}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 */
async function findWishlistMemberByWishlistIdAndUserId(wishlistId, userId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                u.id as userid,
                u.name as username,
                u.email,
                u.createdat,
                uwr.wishlistroleid as roleid
            FROM 
                webshop.user_wishlist_relation as uwr
            JOIN 
                webshop.users as u ON u.id = uwr.userid
            WHERE 
                uwr.wishlistid = $1 AND
                uwr.userid = $2;
            `,
            [wishlistId, userId]
        )
        const rows = result.rows
        if (rows.length <= 0) {
            throw new NotFoundError(
                `WishlistMember with userId ${userId} doesnt exist for wishlist with id ${wishlistId}.`
            )
        }
        //extract member
        const roles = []
        rows.forEach((row) => {
            const role =
                Object.values(WishlistRoles).find(
                    (role) => role.id === row.roleid
                ) || null
            if (null) {
                throw new ServerError(
                    "set Wishlistroles in enum doesn't match the wishlistroles in DB."
                )
            }
            roles.push(role)
        })

        const wishlistMember = new WishlistMember(
            rows[0].userid,
            rows[0].username,
            rows[0].email,
            rows[0].createdat,
            roles
        )
        return wishlistMember
    } catch (error) {
        console.error(error.stack)
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching WishlistMember for userId ${userId} and wishlistId ${wishlistId}`,
            { originalError: error }
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

        if (rows.length <= 0) {
            return []
        }
        const basicUser = new BasicUser(
            rows[0].userid,
            rows[0].username,
            rows[0].email,
            rows[0].createdat
        )

        const wishlists = []
        let lastWishlistId = undefined
        rows.forEach((row) => {
            //extract role
            const role =
                Object.values(WishlistRoles).find(
                    (role) => role.id === row.roleid
                ) || null
            if (null) {
                throw new ServerError(
                    "set Wishlistroles in enum doesn't match the wishlistroles in DB."
                )
            }
            if (
                lastWishlistId == undefined ||
                wishlists.length <= 0 ||
                lastWishlistId != row.id
            ) {
                //add new wishlist
                lastWishlistId = row.id

                const wishlistMember = new WishlistMember(
                    basicUser.id,
                    basicUser.name,
                    basicUser.email,
                    basicUser.createdAt,
                    [role]
                )
                const newWishlist = new BasicWishlist(
                    row.id,
                    row.name,
                    row.description,
                    wishlistMember
                )
                wishlists.push(newWishlist)
            } else {
                //wishlist already in list, just add role
                wishlists[wishlists.length - 1].member.roles.push(role)
            }
        })
        return wishlists
    } catch (error) {
        console.error(error.stack)
        if (error instanceof ServerError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching Wishlists for user with id ${userId}`,
            { originalError: error }
        )
    }
}

/**
 * Creates a new Wishlist in the db and returns the id of the created Wishlist
 * @param {int} ownerId
 * @param {string} name
 * @param {string} description
 * @throws {DatabaseError}
 */
async function createWishlist(ownerId, name, description) {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        //create Wishlist
        const wishlistResult = await client.query(
            `INSERT INTO webshop.wishlists 
                (name, description) 
            VALUES 
                ($1, $2) 
            RETURNING 
                id;`,
            [name, description]
        )
        if (wishlistResult.rows.length <= 0) {
            throw new DatabaseError("Failed creating wishlist")
        }
        const wishlistId = wishlistResult.rows[0].id

        //add owner role
        const roleResult = await client.query(
            `INSERT INTO webshop.user_wishlist_relation
                (userid, wishlistid, wishlistroleid)
            VALUES 
                ($1, $2, $3)
            RETURNING *;
            `,
            [ownerId, wishlistId, WishlistRoles.owner.id]
        )
        if (roleResult.rows.length <= 0) {
            throw new DatabaseError("Failed creating role for wishlist")
        }

        await client.query("COMMIT")
        return wishlistId
    } catch (error) {
        await client.query("ROLLBACK")
        throw new DatabaseError(
            `Failed storing Wishlist in DB: ${error.message}`,
            { originalError: error }
        )
    } finally {
        client.release()
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
    findWishlistMemberByUserIdAndWishlistId,
    findWishlistItemById,
    findWishlistItemsByWishlistId,
    findWishlistsByUserId,
    findWishlistMembersByWishlistId,
    findBasicWishlistByWishlistId,
    createWishlist,
}
