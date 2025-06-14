// Import PostgreSQL
import { pool } from "./pool.js"

// Imports objects
import User from "../objects/user/User.js"
import AuthUser from "../objects/user/AuthUser.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import AdvancedAuthUser from "../objects/user/AdvancedAuthUser.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import BasicUser from "../objects/user/BasicUser.js"
import Roles from "../objects/user/Roles.js"

/**
 * Das Model Product beinhalted alle SQL-Abfragen
 */
const DEFAULT_ROLE = Roles.user

/**
 * returnes true or false, based on if a user with that email exist.
 * @param {string} email
 * @returns {Promise<string>}
 * @throws {DatabaseError}
 */
async function existByEmail(email) {
    try {
        const result = await pool.query(
            `SELECT 1 FROM webshop.users WHERE email = $1 LIMIT 1`,
            [email]
        )
        return result.rows.length > 0
    } catch (error) {
        throw new DatabaseError(
            `Failed proofing if user with email ${email} exist.`
        )
    }
}

/**
 * Returns a User Object if one was found in the Database
 * @returns {Promise<BasicUser>}
 * @throws {NotFoundError} User with Email doesn't exist
 * @throws {DatabaseError}
 */
async function findUserByEmail(email) {
    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.email, u.createdAt as createdAt FROM webshop.users as u WHERE email= $1`,
            [email]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`User with email: ${email} doesn't exist`)
        }
        const row = result.rows[0]
        const user = new BasicUser(row.id, row.name, row.email, row.createdat)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed to find user By email with email: ${email}.`,
            { cause: error }
        )
    }
}

/**
 * finds an auth user by its email
 * @param {string} email
 * @return {Promise<AdvancedAuthUser>}
 * @throws {DatabaseError}
 * @throws {NotFoundError} user with email doesn't exist
 */
async function findAdvancedAuthUserByEmail(email) {
    try {
        const result = await pool.query(
            `SELECT 
                u.id, 
                u.name, 
                u.email,
                u.createdAt,
                u.isVerified,
                u.isBanned, 
                u.password, 
                r.rolename 
            FROM webshop.users as u 
	            JOIN webshop.user_has_role as ur ON ur.userId = u.id
	            JOIN webshop.roles as r ON r.id = ur.roleId
            WHERE u.email = $1 ;`,
            [email]
        )
        const rows = result.rows
        if (rows.length === 0) {
            throw new NotFoundError(`User with email ${email} doesn't exist`)
        }

        //extract roles
        const roles = []
        rows.forEach((row) => {
            roles.push(row.rolename)
        })
        //create user
        const user = new AdvancedAuthUser(
            rows[0].id,
            rows[0].name,
            rows[0].email,
            rows[0].createdat,
            rows[0].isverified,
            rows[0].isbanned,
            roles,
            rows[0].password
        )
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `failed to fetch authUser by email ${email}, from database: ${error.message}`,
            { cause: error }
        )
    }
}

/**
 * Creates a User in the Database
 * @param {string} username
 * @param {string} hashedPassword
 * @param {string} email
 * @returns {Promise<AuthUser>}
 * @throws {DatabaseError}
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
            [userId, DEFAULT_ROLE.id]
        )

        //executing all querys
        await client.query("COMMIT")
        return new AuthUser(userId, username, email, Date.now(), false, false, [
            DEFAULT_ROLE.roleName,
        ])
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

export default {
    createUser,
    findAdvancedAuthUserByEmail,
    existByEmail,
    findUserByEmail,
}
