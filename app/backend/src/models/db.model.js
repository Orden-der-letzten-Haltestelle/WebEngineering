import DatabaseError from "../exceptions/DatabaseError.js";
import { pool } from "./pool.js";

async function testDbConnection() {
    console.log(process.env.DB_PASSWORD)
    try {
        await pool.query("SELECT 1")
        return true
    } catch (error) {
        throw new DatabaseError(`Database connection test failed: ${error.message}`, { cause: error })
    }
}
export default {
    testDbConnection
}