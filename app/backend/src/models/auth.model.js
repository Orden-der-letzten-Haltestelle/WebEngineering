// Import PostgreSQL
import { pool } from "./pool.js";

// Imports objects
import User from "../objects/user/User.js";
import HttpError from "../exceptions/HttpError.js";

/**
 * Das Model Product beinhalted alle SQL-Abfragen
 */

/**
 * Creates a User in the Database
 * @returns User
 */
async function createUser(username, hashedPassword, email) {
    try {
        const result = await pool.query(`INSERT INTO webshop.users (name, password, email) VALUES ('${username}','${hashedPassword}','${email}')`);
        return getUserByEmail(email);
    } catch (cause) {
        throw new HttpError(`Email ${email} is already used`, 400, { cause });
    }
}

/**
 * Returns a User Object if one was found in the Database
 * @returns User
 */
async function getUserByEmail(email) {
    const result = await pool.query(`SELECT * FROM webshop.users WHERE email='${email}'`);
    if (result.rows.length == 0) {
        throw new HttpError(`User ${email} was not found`, 400);
    }
    const user = createUserFromQueryRow(result.rows[0]);
    return user;
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
        row.password,
        [],
        row.isbanned,
        row.isverified,
        row.createdat,
        [],
        []
    );
}

export default {
    createUser,
    getUserByEmail
}
