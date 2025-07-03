//service
import AuthModel from "../models/auth.model.js"
import AuthValidator from "../validator/validator.auth.js"
import ProductService from "../services/product.service.js"

//jwt
import bcrypt from "bcryptjs"
import ms from "ms"
import jwt from "jsonwebtoken"

//objects
import AuthUser from "../objects/user/AuthUser.js"
import Roles from "../objects/user/Roles.js"

//errors
import TokenVerificationError from "../exceptions/TokenVerificationError.js"
import ForbiddenError from "../exceptions/ForbiddenError.js"
import UnauthorizedError from "../exceptions/UnauthorizedError.js"
import AuthenticationError from "../exceptions/AuthenticationError.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import ServerError from "../exceptions/ServerError.js"


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

    //TODO replace with has user access
    //check if the user has the required role
    if (
        requiredRole !== undefined &&
        (!user.roles || !user.hasRole(requiredRole))
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
            { originalError: error }
        )
    }
}

/**
 * Admin should be abel to access this endpoint, to verify, if the user given with the id
 * can access the resource and perform that action.
 * @param {int} userId 
 * @param {Roles} roles 
 * @param {string} ressource 
 * @param {string} action 
 */
async function hasUserAccessToResource(userId, ressourceId, ressource, action) {
    try {
        const user = await getAuthUser(userId)
        if (user.hasRole(Roles.admin)) {
            //TODO should an admin be abel to delete a user
            return true
        }

        //TODO proof, that valid action is given

        switch (ressource) {
            case "product":
                await hasUserAccessToProduct(user, ressourceId, action)
        }


    } catch (error) {

    }
}

/**
 * Verify if the given user can make the given action. 
 * if no productId is given, it test overall, if the user could make this request for any product.
 * When ProductId is given, we also trest, if the product exists
 * 
 * @param {AuthUser} user 
 * @param {int} productId 
 * @param {string} action 
 * @returns 
 * @throws {ServerError}
 */
async function hasUserAccessToProduct(user, productId, action) {
    try {
        switch (action) {
            case "GET":
                //when productId given, product needs to exist
                if (productId != null) {
                    await ProductService.getProductById(productId)
                }
                return true
            case "POST":
            case "PUT":
            case "DELETE":
                //product needs to be given and needs to exist
                if (productId == null) return false
                await ProductService.getProductById(productId)

                //user needs to be admin
                return user.hasRole(Roles.admin)
            default:
                return false
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            return false
        }
        throw new ServerError("Failed proofing, if user has access to product.")
    }
}


export default {
    getAuthUser,
    createUser,
    extractTokenAndVerify,
    verifyLoginInformation,
    hasUserAccessToResource
}
