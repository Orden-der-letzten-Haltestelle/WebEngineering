import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import BasicUser from "../objects/user/BasicUser.js"
import { pool } from "./pool.js"

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
            error
        )
    }
}

export default {
    findBasicUserById,
}
