import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import BasicUser from "../objects/user/BasicUser.js"
import AuthModel from "../models/auth.model.js"
import { pool } from "./pool.js"
import AuthUser from "../objects/user/AuthUser.js"
import BadRequestError from "../exceptions/BadRequestError.js"

/**
 * Returns a BasicUser by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} userId
 * @returns {Promise<BasicUser>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function findBasicUserById(userId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.createdat 
            FROM 
                webshop.users as u 
            WHERE u.id = $1;`,
            [userId]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`)
        }
        const row = result.rows[0]
        const user = new BasicUser(row.id, row.name, row.email, row.createdat)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching user with id ${id}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * Deletes an User in Database with the given id.
 * @param {int} userId
 * @throws {DatabaseError}
 */
async function deleteUserById(userId) {
    try {
        await pool.query("BEGIN")

        const resultRole = await pool.query(
            `
            DELETE FROM
                webshop.user_has_role as ur
            WHERE
                ur.userid = $1
            RETURNING *;
            `,
            [userId]
        )
        const userIsOwnerOfWishlist = await pool.query(
            `SELECT * FROM webshop.user_wishlist_relation as w
            WHERE w.userid = $1 and w.wishlistroleid = 1;
            `,
            [userId]
        )
        if (userIsOwnerOfWishlist.rows.length > 0) {
            const idWishlist = userIsOwnerOfWishlist.rows[0].wishlistid
            const deleteWishlistItems = await pool.query(
                `DELETE FROM webshop.wishlistitems as wi
                WHERE wi.wishlistid = $1
                RETURNING *;
                `,
                [idWishlist]
            )
            const deleteRolesOfOthers = await pool.query(
                `DELETE FROM webshop.user_wishlist_relation as wu
                WHERE wu.wishlistid = $1
                RETURNING *;
                `,
                [idWishlist]
            )
            if (deleteRolesOfOthers.rows.length <= 0) {
                throw new DatabaseError(
                    "Failed to delete wishlist roles which user is owner of"
                )
            }
            const deleteWishlist = await pool.query(
                `DELETE FROM webshop.wishlists as w
                WHERE w.id = $1
                RETURNING *;
                `,
                [idWishlist]
            )
            if (deleteWishlist.rows.length <= 0) {
                throw new DatabaseError(
                    "Failed to delete wishlist which user is owner of"
                )
            }
        }
        const resultWishlist = await pool.query(
            `
            DELETE FROM
                webshop.user_wishlist_relation as w
            WHERE
                w.userid = $1
            RETURNING *;
            `,
            [userId]
        )
        const resultCart = await pool.query(
            `
            DELETE FROM
                webshop.cartItems as cI
            WHERE
                cI.userid = $1
            RETURNING *;
            `,
            [userId]
        )
        const result = await pool.query(
            `
            DELETE FROM
                webshop.users as u
            WHERE
                u.id = $1
            RETURNING *;
            `,
            [userId]
        )
        if (result.rows.length <= 0) {
            throw new DatabaseError("Failed to delete user")
        }
        await pool.query("COMMIT")
    } catch (error) {
        await pool.query("ROLLBACK")
        throw new DatabaseError(
            `Failed on deleteUser with userId ${userId}: ${error}`,
            error
        )
    }
}

/**
 * Banns a User by userId, if no user with that id exist, an NotFoundError will be thrown
 * If no roles for user(only when created in db) might be an error, but still ban user
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function bannUserById(userId) {
    try {
        // Überprüfen, ob der Nutzer existiert
        const userCheck = await pool.query(
            `SELECT id FROM webshop.users WHERE id = $1`,
            [userId]
        )
        if (userCheck.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`)
        }

        // Nutzer bannen
        const result = await pool.query(
            ` 
            UPDATE webshop.users
            SET isbanned=true
            WHERE id = $1
            RETURNING *;`,
            [userId]
        )

        if (result.rows.length <= 0) {
            throw new DatabaseError(`Failed to ban user with id ${userId}`)
        }

        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed banning user with id ${userId}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * UnBanns a User by userId, if no user with that id exist, an NotFoundError will be thrown
 * If no roles for user(only when created in db) might be an error, but still unbann user
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function unBannUserById(userId) {
    try {
        // Überprüfen, ob der Nutzer existiert
        const userCheck = await pool.query(
            `SELECT id FROM webshop.users WHERE id = $1`,
            [userId]
        )
        if (userCheck.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`)
        }

        // Nutzer unbannen
        const result = await pool.query(
            ` 
            UPDATE webshop.users
            SET isbanned=false
            WHERE id = $1
            RETURNING *;`,
            [userId]
        )

        if (result.rows.length <= 0) {
            throw new DatabaseError(`Failed to unban user with id ${userId}`)
        }

        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed unbanning user with id ${userId}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * gets an User by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function getUserById(userId) {
    try {
        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed getting user with id ${userId}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * makes Admin of a User by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function makeAdmin(userId) {
    try {
        // Überprüfen, ob der Nutzer existiert
        const userCheck = await pool.query(
            `SELECT id FROM webshop.users WHERE id = $1`,
            [userId]
        )
        if (userCheck.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`)
        }

        const checkIfAdmin = await pool.query(
            `SELECT * FROM webshop.user_has_role WHERE userid = $1 and roleid = 2`,
            [userId]
        )
        if (!(checkIfAdmin.rows.length <= 0)) {
            throw new BadRequestError(`User with id ${userId} is already admin`)
        } else {
            const result = await pool.query(
                `INSERT INTO webshop.user_has_role(
                userid, roleid)
                VALUES ($1, 2)
                RETURNING *;`,
                [userId]
            )
            if (result.rows.length <= 0) {
                throw new DatabaseError(
                    `Failed to make admin of user with id ${userId}`
                )
            }
        }

        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error
        }
        throw new DatabaseError(
            `Failed to make admin of user with id ${userId}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * makes No Admin of a User by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function makeNoAdmin(userId) {
    try {
        // Überprüfen, ob der Nutzer existiert
        const userCheck = await pool.query(
            `SELECT id FROM webshop.users WHERE id = $1`,
            [userId]
        )
        if (userCheck.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`)
        }

        const checkIfAdmin = await pool.query(
            `SELECT * FROM webshop.user_has_role WHERE userid = $1 and roleid = 2`,
            [userId]
        )
        if (checkIfAdmin.rows.length <= 0) {
            throw new BadRequestError(`User with id ${userId} is already not an admin`)
        } else {
            const result = await pool.query(
                `DELETE FROM webshop.user_has_role
	            WHERE userId = $1 and roleid = 2
                RETURNING *;`,
                [userId]
            )
            if (result.rows.length <= 0) {
                throw new DatabaseError(
                    `Failed to make no admin of user with id ${userId}`
                )
            }
        }

        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error
        }
        throw new DatabaseError(
            `Failed to make no admin of user with id ${userId}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * Returns a BasicUser by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} email
 * @returns {Promise<BasicUser>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function getUserByMail(email) {
    try {
        const result = await AuthModel.findUserByEmail(email)
        return result
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching user with email ${email}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * gets all AuthUsers
 * @returns {Promise<AuthUser[]>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function getAllUsers() {
    try {
        const result = await pool.query(
            `SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.isbanned, 
                u.isverified, 
                u.createdat,
                r.rolename
            FROM 
                webshop.users as u
            JOIN webshop.user_has_role as ur ON u.id = ur.userid
            JOIN webshop.roles as r ON r.id = ur.roleid
            ORDER BY u.id;`
        )
        const rows = result.rows || []
        const users = []
        rows.forEach((row) => {
            if (users.length >= 1 && users[users.length - 1].id == row.id) {
                //user already in, just add role
                users[users.length - 1].roles.push(row.rolename)
            } else {
                const user = new AuthUser(
                    row.id,
                    row.name,
                    row.email,
                    row.createdat,
                    row.isverified,
                    row.isbanned,
                    [row.rolename]
                )
                users.push(user)
            }
        })

        return users
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(`Failed fetching users: ${error}`, {
            originalError: error,
        })
    }
}

export default {
    findBasicUserById,
    deleteUserById,
    bannUserById,
    unBannUserById,
    getUserById,
    makeAdmin,
    makeNoAdmin,
    getUserByMail,
    getAllUsers,
}
