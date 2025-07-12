import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import { pool } from "./pool.js"

/**
 * Returns the User_wishlist_relation item by id
 * @param {int} id
 * @returns {Promise<object>}
 * @throws {DatabaseError}
 */
async function findUser_wishlist_relation_byId(id) {
    try {
        const result = await pool.query(
            `
                SELECT *
                FROM webshop.user_wishlist_relation as uwr 
                WHERE 
                    uwr.id=$1
            `,
            [id]
        )

        if (result?.rows.length <= 0) {
            throw new NotFoundError(
                `User_wishlist_relation Item with id ${id} doesn't exist`
            )
        }
        return result?.rows[0]
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching user_wishlist_relation item with id: ${id} from db: ${error}`,
            { originalError: error }
        )
    }
}

export default {
    findUser_wishlist_relation_byId,
}
