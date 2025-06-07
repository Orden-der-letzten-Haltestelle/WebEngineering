// Import PostgreSQL
import { pool } from "./pool.js"

// Imports objects
import User from "../objects/user/User.js"
import AuthUser from "../objects/user/AuthUser.js"
import HttpError from "../exceptions/HttpError.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import AdvancedAuthUser from "../objects/user/AdvancedAuthUser.js"

/**
 * Das Model Product beinhalted alle SQL-Abfragen
 */
const DEFAULT_ROLE_ID = 1

/**
 * Creates a User in the Database
 * @returns User
 */
async function createUser(username, hashedPassword, email) {
    const client = await pool.connect()
    try {
        //start query client, to be abel to rollback if needed
        await client.query("BEGIN")

        //save user information in db
        const result = await client.query(
            `INSERT INTO webshop.users (name, password, email) VALUES ($1, $2, $3) RETURNING id`,
            [username, hashedPassword, email]
        )
        const userId = result.rows[0].id

        //add default role to user
        await client.query(
            `INSERT INTO webshop.user_has_role (userid, roleid) VALUES ($1, $2)`,
            [userId, DEFAULT_ROLE_ID]
        )

        //executing all querys
        await client.query("COMMIT")
        return new AuthUser(userId, username, email, undefined, ["user"])
    } catch (error) {
        //When error is thrown, rollback
        await client.query("ROLLBACK")
        throw new DatabaseError(
            `Failed storing user data in the DB: ${error.message}`,
            { cause: error }
        )
    } finally {
        client.release()
    }
}

/**
 * Returns a User Object if one was found in the Database
 * @returns User
 */
async function getUserByEmail(email) {
    const result = await pool.query(
        `SELECT * FROM webshop.users WHERE email='${email}'`
    )
    if (result.rows.length == 0) {
        throw new HttpError(`User ${email} was not found`, 400)
    }
    const user = createUserFromQueryRow(result.rows[0])
    return user
}

/**
 * finds an auth user by its email
 * @param {string} email
 * @return {Promise<AdvancedAuthUser | null>}
 */
async function findAdvancedAuthUserByEmail(email) {
    try {
        const result = await pool.query(
            `SELECT * FROM webshop.users WHERE email = $1`,
            [email]
        )
        const row = result.rows[0]
        if (!row) return null

        //TODO get roles
        const roles = ["user", "admin"]

        return new AuthUser(row.id, row.name, row.email, row.password, roles)
    } catch (error) {
        throw new DatabaseError(
            `failed to fetch authUser by email ${email}, from database: ${error.message}`,
            { cause: error }
        )
    }
}

/**
 * Creates a User Object from a SQL SELECT row
 * @returns User Object
 */
async function createUserFromQueryRow(row) {
    return new User(
        row.id,
        row.name,
        row.email,
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
    findAdvancedAuthUserByEmail,
    getUserByEmail,
}
