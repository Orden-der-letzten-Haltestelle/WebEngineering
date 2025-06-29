//import
import AuthModel from "../models/auth.model.js"
import TokenVerificationError from "../exceptions/TokenVerificationError.js"

// Import other
import ForbiddenError from "../exceptions/ForbiddenError.js"
import UnauthorizedError from "../exceptions/UnauthorizedError.js"
import bcrypt from "bcryptjs"
import ms from "ms"
import jwt from "jsonwebtoken"
import AuthenticationError from "../exceptions/AuthenticationError.js"
import AuthValidator from "../validator/validator.auth.js"
import AuthUser from "../objects/user/AuthUser.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"

const SECRET_KEY = "your-secret-key" // In production, use environment variables
const JWT_TOKEN_EXPIRES_IN = "1h"
const BEARER_PREFIX = "Bearer"
const PASSWORD_HASH_SALT = 10

/**
 * Buisiness logic für den Auth service
 */

/**
 * Returns an auth user by his id
 * @param {int} userId
 * @returns {Promise<AuthUser>}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 */
async function getAuthUser(userId) {
    return await AuthModel.findAuthUserById(userId)
}

/**
 * Create a User in the DB, hashes the password and sends out an Email
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns {Promise<Object>} [user, jwt]
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
    const jwt = generateJWTtoken(user)
    return {
        user: user,
        jwt: jwt,
    }
}

/**
 * Verifys Login information and returns a valid JWT token, with the user Information
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} JWT-token
 */
async function verifyLoginInformation(email, password) {
    const advancedAuthUser = await AuthModel.findAdvancedAuthUserByEmail(email)

    await AuthModel.findUserByEmail(email)

    //compare given password and stored password
    if (!bcrypt.compareSync(password, advancedAuthUser.password)) {
        throw new AuthenticationError()
    }

    //generate JWT token
    const jwt = generateJWTtoken(advancedAuthUser)
    //return user with out password and jwt token
    return { user: advancedAuthUser.getAuthUser(), jwt: jwt }
}

/**
 * Generates a JWT-Token for the given user
 * @param {AuthUser} authUser
 * @returns {Object} {token, expiresAt}
 */
function generateJWTtoken(authUser) {
    const expiresInMs = ms(JWT_TOKEN_EXPIRES_IN)
    const expiresAt = Date.now() + expiresInMs

    const token = jwt.sign(
        { id: authUser.id, username: authUser.username, roles: authUser.roles },
        SECRET_KEY,
        { expiresIn: JWT_TOKEN_EXPIRES_IN }
    )
    return {
        token: `${BEARER_PREFIX} ${token}`,
        epiresAt: expiresAt,
    }
}

async function extractTokenAndVerify(token, requiredRole) {
    //when token empty, throw 401
    if (!token) {
        throw new UnauthorizedError()
    }

    //proof token and extract information from token
    const user = await getUserInformationByJWTtoken(token)

    //check if the user has the required role
    if (
        requiredRole !== undefined &&
        (!user.roles || !user.roles.includes(requiredRole.roleName))
    ) {
        throw new ForbiddenError()
    }

    //gets an AuthUser Object to verify whether the user is banned
    const authUser = await getAuthUser(user.id)
    
    if (authUser.isBanned) {
        throw new ForbiddenError("User is banned!");
    }

    //or not yet verified and therefore can't access
    if (!authUser.isVerified) {
        throw new ForbiddenError("User is not verified yet!")
    }

    return user
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
 * @returns {Promise<object>} without email
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
    getAuthUser,
    createUser,
    extractTokenAndVerify,
    verifyLoginInformation,
}
