// Import PostgreSQL
import { pool } from "./pool.js"

// Imports objects
import User from "../objects/user/User.js"
import DatabaseError from "../exceptions/DatabaseError.js"

/*
Das Model Product beinhalted alle SQL-Abfragen
*/

/**
 * Creates a User
 */
async function createUser(username, password, email) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`INSERT INTO webshop.users (name, password, email) VALUES ('${username}','${hashedPassword}','${email}')`)
        return result
    } catch (error) {
        throw new DatabaseError(`Could not create User ${username} in the database`, {
            cause: error,
        })
        // ERROR: username, password, email are to
        // ERROR: duplicate key value email
    }
}

async function getUserByEmail(email) {
    try {
        const result = await pool.query(`SELECT * FROM webshop.users WHERE email='${email}'`);
        const user = createUserFromQueryRow(result.rows[0]);
        return user;
    } catch (error) {
        throw new DatabaseError(`Could not find User ${email} in the database`, {
            cause: error,
        })
        // ERROR: user was not found OR just retunr NULL
    }
}

async function createUserFromQueryRow(row) {
    return new User(
        row.id,
        row.name,
        row.email,
        row.password,
        [],
        row.isbanned,
        row.isverified,
        row.createdat,
        [],
        []
    )
}

export default {
    createUser,
    getUserByEmail
}
