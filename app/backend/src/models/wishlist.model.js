import { pool } from "./pool.js"

//objects
import WishlistItem from "../objects/items/WishlistItem.js"
import WishlistMember from "../objects/user/WishlistMember.js"
import Wishlist from "../objects/wishlist/Wishlist.js"
import Product from "../objects/items/Product.js"
import Roles from "../objects/user/Roles.js"
import BasicUser from "../objects/user/BasicUser.js"
import BasicWishlist from "../objects/wishlist/BasicWishlist.js"
import WishlistRoles from "../objects/user/WishlistRoles.js"

//Errors
import NotFoundError from "../exceptions/NotFoundError.js"
import ServerError from "../exceptions/ServerError.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import BadRequestError from "../exceptions/BadRequestError.js"

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
        throw new DatabaseError(`Failed fetching BasicWishlist with id ${id}`, {
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

async function updateWishlist(wishlistId, name, description) {
    try {
        const result = await pool.query(
            `UPDATE
                webshop.wishlists as w
            SET
                name = $2,
                description = $3
            WHERE
                w.id = $1
            RETURNING *`,
            [wishlistId, name, description]
        )
        // Error 404 is already catched earlier

        return result.rows[0]
    } catch (error) {
        throw new DatabaseError(
            `Failed updating Storage Amount for product with id ${wishlistId}: ${error}`,
            { originalError: error }
        )
    }
}

async function addUserToWishlist(wishlistId, userId, roleLevel) {
    const role = roleLevel == "1" ? WishlistRoles.read : WishlistRoles.write
    try {
        const amountOfRoles = await pool.query(
            `SELECT COUNT(*) FROM 
                webshop.user_wishlist_relation as r
            WHERE
                r.userid=$1 AND
                r.wishlistid=$2
            `,
            [userId, wishlistId]
        )
        console.log()
        if (amountOfRoles.rows[0].count != 0) {
            throw new BadRequestError(`The user with id: ${userId} already has a role. You can change this Role under PUT /api/wishlist/permission/:userWishlistRelationId`)
        }
        const result = await pool.query(
            `INSERT INTO webshop.user_wishlist_relation
                (userid, wishlistid, wishlistroleid)
            VALUES 
                ($1, $2, $3)
            RETURNING *;`,
            [userId, wishlistId, role.id]
        )

        if (result.rows.length <= 0) {
            throw new DatabaseError(`Failed adding the role ${roleLevel} to user ${userId} for the wishlist ${wishlistId}`)
        }

        return result.rows[0]
    } catch (error) {
        if (typeof (error) == BadRequestError) {
            throw error
        }
        throw new DatabaseError(
            `Failed to add User with id: ${userId} to the wishlist with id: ${wishlistId}; ${error}`,
            { originalError: error }
        )
    }
}

async function getRelationById(relationId) {
    try {
        const result = await pool.query(
            `SELECT * FROM
                webshop.user_wishlist_relation
            WHERE
                id=$1`,
            [relationId]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`WishlistRealtion with id: ${relationId} was not Found`)
        }
        return result.rows[0]
    } catch (error) {
        if (typeof (error) == NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed to find the wishlistRealtion of id: ${relationId}; ${error}`,
            { originalError: error }
        )
    }
}

async function changeRoleOfRelation(relationId, roleLevel) {
    const role = roleLevel == "1" ? WishlistRoles.read : WishlistRoles.write
    try {
        const result = await pool.query(
            `UPDATE
                webshop.user_wishlist_relation as r
            SET
                wishlistroleid=$2
            WHERE
                r.id=$1
            RETURNING *`,
            [relationId, role.id]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`WishlistRealtion with id: ${relationId} was not Found`)
        }
        return result.rows[0]
    } catch (error) {
        if (typeof (error) == NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed to change the role of a user in the wishlistRealtion of id: ${relationId}; ${error}`,
            { originalError: error }
        )
    }
}

async function deleteRelationFromWishlist(relationId) {
    try {
        const result = await pool.query(
            `DELETE FROM
                webshop.user_wishlist_relation as r
            WHERE
                r.id=$1 AND
                r.wishlistroleid!=$2
            RETURNING *`,
            [relationId, 1]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`WishlistRealtion with id: ${relationId} was not Found`)
        }
        return result.rows[0]
    } catch (error) {
        if (typeof (error) == NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed to delete the user of the wishlistRealtion of id: ${relationId}; ${error}`,
            { originalError: error }
        )
    }
}

export default {
    findWishlistMemberByUserIdAndWishlistId,
    findWishlistsByUserId,
    findWishlistMembersByWishlistId,
    findBasicWishlistByWishlistId,
    createWishlist,
    updateWishlist,
    addUserToWishlist,
    getRelationById,
    changeRoleOfRelation,
    deleteRelationFromWishlist,
}
