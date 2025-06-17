import DatabaseError from "../exceptions/DatabaseError.js"
import { pool } from "./pool.js"

async function findCartItemsByUserId(userId) {
    try {
        
    } catch (error) {
        throw new DatabaseError(
            `Failed fetching Cart items for user with id: ${userId} form db: ${error}`,
            error
        )
    }
}
