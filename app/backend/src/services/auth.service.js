//import
import AuthModel from "../models/auth.model.js"

/**
 * Buisiness logic für den Auth service
 */

/**
 * Creates a User
 * Send out the Email
 * @returns
 */
async function createUser(username, password, email) {
    // TO DO: Is the password secure enough?
    const user = AuthModel.createUser(username, password, email)
    // Send out the Email if succesfull
    return user
}

async function getUserByEmail(email) {
    const user = AuthModel.getUserByEmail(email);
    return user;
}

export default {
    createUser,
    getUserByEmail
}
