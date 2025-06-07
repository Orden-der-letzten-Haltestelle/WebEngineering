//import
import AuthModel from "../models/auth.model.js"
import HttpError from "../exceptions/HttpError.js"
import TokenVerificationError from "../exceptions/TokenVerificationError.js"

// Import other
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import AuthenticationError from "../exceptions/AuthenticationError.js"

const SECRET_KEY = "your-secret-key" // In production, use environment variables

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

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await AuthModel.createUser(username, hashedPassword, email)
    // TO DO: Send out the Email if succesfull

    return user
}

/**
 * Verifys Login information and returns a valid JWT token, with the user Information
 * @param {string} email
 * @param {string} password
 * @returns {string} JWT-token
 */
async function verifyLoginInformation(email, password) {
    const authUser = await AuthModel.findAuthUserByEmail(email)

    //compare given password and stored password
    if (!bcrypt.compareSync(password, authUser.password)) {
        throw new AuthenticationError()
    }

    //generate JWT token
    const jwtToken = generateJWTtoken(authUser)
    return jwtToken
}

/**
 * Generates a JWT-Token for the given user
 * @param {AuthUser} authUser
 * @returns {string}
 */
async function generateJWTtoken(authUser) {
    const token = jwt.sign(
        { id: authUser.id, username: authUser.username, roles: authUser.roles },
        SECRET_KEY,
        { expiresIn: "1h" }
    )
    return token
}

/**
 * Verify, that the given JWT token is valid and return the Userinformation.
 * saves user information in the req, for the next request to use
 * in This format:
 * user: {
 *      id: "3945786",
 *      roles: [
 *          "admin",
 *          "user"
 *      ]
 * }
 * @param {string} token
 * @throws {TokenVerificationError}
 */
async function getUserInformationByJWTtoken(token) {
    jwt.verify(token, SECRET_KEY, (error, user) => {
        if (error) {
            throw new TokenVerificationError(
                `Failed to verify User by given token ${token} \n Erro: ${error.message}`,
                { cause: error }
            )
        }
        console.log(`validated User: `, user)
        return user
    })
}

export default {
    createUser,
    getUserInformationByJWTtoken,
    verifyLoginInformation,
}
