//import
import AuthModel from "../models/auth.model.js"
import HttpError from "../exceptions/HttpError.js";

// Import other
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const SECRET_KEY = 'your-secret-key'; // In production, use environment variables

/**
 * Buisiness logic für den Auth service
 */


/**
 * Create a User in the DB, hashes the password and sends out an Email
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @returns 
 */
async function createUser(username, password, email) {
    // TO DO: Is the password secure enough?

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await AuthModel.createUser(username, hashedPassword, email)
    // TO DO: Send out the Email if succesfull

    return user
}
/**
 * If User was found generates JWT Session Token
 * @param {string} email 
 * @param {string} password 
 * @returns JWT
 */
async function getTokenFromEmail(email, password) {
    const user = await AuthModel.getUserByEmail(email);

    if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return { token }
    } else {
        throw new HttpError('Invalid credentials', 400)
    }
}

export default {
    createUser,
    getTokenFromEmail
}
