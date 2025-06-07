//import
import AuthModel from "../models/auth.model.js"
import TokenVerificationError from "../exceptions/TokenVerificationError.js"

// Import other
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import AuthenticationError from "../exceptions/AuthenticationError.js"
import AuthValidator from "../validator/validator.auth.js"
import AuthUser from "../objects/user/AuthUser.js"

const SECRET_KEY = "your-secret-key" // In production, use environment variables
const JWT_TOKEN_EXPIRES_IN = "1h"
const BEARER_PREFIX = "Bearer"
const PASSWORD_HASH_SALT = 10

/**
 * Buisiness logic für den Auth service
 */

/**
 * Create a User in the DB, hashes the password and sends out an Email
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns {Promise<[AuthUser, string]>} [user, jwtToken]
 */
async function createUser(username, password, email) {
    //verify, that email and password are fitting requirements.
    AuthValidator.isSecurePassword(password)
    await AuthValidator.isValidEmail(email)

    //hash password
    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT)

    //create user
    const user = await AuthModel.createUser(username, hashedPassword, email)

    // TODO Send out the Email if succesfull

    //generate jwtToken
    const jwtToken = generateJWTtoken(user)
    return [user, jwtToken]
}

/**
 * Verifys Login information and returns a valid JWT token, with the user Information
 * @param {string} email
 * @param {string} password
 * @returns {Promise<[BasicUser, string]>} JWT-token
 */
async function verifyLoginInformation(email, password) {
    const authUser = await AuthModel.findAdvancedAuthUserByEmail(email)

    //compare given password and stored password
    if (!bcrypt.compareSync(password, authUser.password)) {
        throw new AuthenticationError()
    }

    //generate JWT token
    const jwtToken = generateJWTtoken(authUser)
    //return user with out password and jwt token
    return [new AuthUser({ ...authUser }), jwtToken]
}

/**
 * Generates a JWT-Token for the given user
 * @param {AuthUser} authUser
 * @returns {string}
 */
function generateJWTtoken(authUser) {
    const token = jwt.sign(
        { id: authUser.id, username: authUser.username, roles: authUser.roles },
        SECRET_KEY,
        { expiresIn: JWT_TOKEN_EXPIRES_IN }
    )
    return `${BEARER_PREFIX} ${token}`
}

/**
 * Verify, that the given JWT token is valid and return the Userinformation.
 * saves user information in the req, for the next request to use
 * in This format:
 * user: {
 *      id: "3945786",
 *      username: "negroberd",
 *      roles: [
 *          "admin",
 *          "user"
 *      ]
 * }
 * @param {string} token
 * @returns {Promise<AuthUser>} without email
 * @throws {TokenVerificationError}
 */
async function getUserInformationByJWTtoken(token) {
    //proof for bearer prefix
    if (!token.startsWith(BEARER_PREFIX)) {
        throw new TokenVerificationError(
            `Bearer token doesn't fit format, 'Bearer' infront of token is missing`
        )
    }

    //remove Bearer prefix
    const extractedToken = token.slice(BEARER_PREFIX.length).trim()

    //verify token
    try {
        const user = jwt.verify(extractedToken, SECRET_KEY)
        console.log(`validated User: `, user)
        return user
    } catch (error) {
        throw new TokenVerificationError(
            `Failed to verify User by given token ${token} \n Erro: ${error.message}`,
            { cause: error }
        )
    }
}

export default {
    createUser,
    getUserInformationByJWTtoken,
    verifyLoginInformation,
}
