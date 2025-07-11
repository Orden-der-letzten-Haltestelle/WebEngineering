//service
import AuthModel from "../models/auth.model.js"
import ProductService from "../services/product.service.js"
import CartService from "../services/cart.service.js"

//jwt
import bcrypt from "bcryptjs"
import ms from "ms"
import jwt from "jsonwebtoken"

// Import EmailService
import EmailService from "./email.service.js"

//objects
import AuthUser from "../objects/user/AuthUser.js"
import Roles from "../objects/user/Roles.js"
import OrderItem from "../objects/items/OrderItem.js"
import cartModel from "../models/cart.model.js"

//errors
import NotImplementedError from "../exceptions/NotImplementedError.js"
import ForbiddenError from "../exceptions/ForbiddenError.js"
import TokenVerificationError from "../exceptions/TokenVerificationError.js"
import UnauthorizedError from "../exceptions/UnauthorizedError.js"
import AuthenticationError from "../exceptions/AuthenticationError.js"
import AuthValidator from "../validator/validator.auth.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import ServerError from "../exceptions/ServerError.js"
import BadRequestError from "../exceptions/BadRequestError.js"

const SECRET_KEY = "your-secret-key" // In production, use environment variables
const JWT_TOKEN_EXPIRES_IN = "1d"
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
    await sendVerificationEmail(email)

    //generate jwtToken
    const jwt = generateJWTtoken(user)
    return {
        user: user,
        jwt: jwt,
    }
}

/**
 * Create an Admin in the DB, hashes the password and sends out an Email
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns {Promise<Object>} [user, jwt]
 */
async function createAdmin(username, password, email) {
    //verify, that email and password are fitting requirements.
    AuthValidator.isSecurePassword(password)
    await AuthValidator.isValidEmail(email)

    //hash password
    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT)

    //create user
    const user = await AuthModel.createAdmin(username, hashedPassword, email)

    // TODO Send out the Email if succesfull
    await sendVerificationEmail(email)

    //generate jwtToken
    const jwt = generateJWTtoken(user)
    return {
        user: user,
        jwt: jwt,
    }
}

/**
 * sends verification email, so that users verify themselves via a link provided in the mail
 */
async function sendVerificationEmail(email) {
    const subject = "Bitte verifizieren Sie Ihre Email"
    const rand = () => {
        return Math.random().toString(36).substr(2)
    }

    const generateToken = () => {
        return rand() + rand()
    }
    const token = generateToken()

    const resultTokenSave = AuthModel.saveTokenVerification(email, token, "verify")

    let emailBody = `
        <html>
        <head>
            <style>
               body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                h1 {
                    color: #DBC70C;
                    text-align: center;
                    font-size: 16;
                    padding-top: 40px;
                    padding-bottom: 40px;
                }
                p {
                    color: #000;
                    font-size: 12;
                    text-align: center
                    padding-bottom: 30px;
                }
                a {
                    color: #DBC70C;
                    font-size: 12;
                    text-decoration: underline; 
                    text-align: center
                }
                a:hover {
                    color:rgb(50, 48, 48); 
                    text-decoration:underline; 
                    cursor:pointer;  
                }
            </style>
        </head>
        <body>
        <h1>Verifizierung Ihres Accounts - OdlH</h1>
        <p>Bitte klicken Sie auf diesen Link, um ihre Registrierung abzuschließen und ihre Email zu verifizieren:<p>
        <a href="http://localhost:3000/user/verify/${token}"><b>Registrierung abschließen</b></a>
        </body>
        </html>
    `

    EmailService.sendHtmlMail(email, subject, emailBody)
}

/**
 * Verifys the email of a newly registered user
 * @param {int} userId
 * @param {string} token
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 */
async function verifyEmail(token) {
    return await AuthModel.verifyEmail(token)
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

    //gets an AuthUser Object to verify whether the user is banned
    const authUser = await getAuthUser(user.id)

    //TODO replace with has user access
    //check if the user has the required role
    if (
        requiredRole !== undefined &&
        (!authUser.roles || !authUser.hasRole(requiredRole))
    ) {
        throw new ForbiddenError()
    }

    if (authUser.isBanned) {
        throw new ForbiddenError("User is banned!")
    }

    //or not yet verified and therefore can't access
    // if (!authUser.isVerified) {
    //     throw new ForbiddenError("User is not verified yet!")
    // }

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

async function sendLoginMail(email) {
    const rand = () => {
        return Math.random().toString(36).substr(2);
    };

    const generateToken = () => {
        return rand() + rand();
    };
    const token = generateToken()

    const resultTokenSave = AuthModel.saveTokenVerification(email, token, "login")

    // create the link
    const host = `http://localhost:3000` // TO DO: Dynamic from config.js
    const link = `${host}/user/login/${token}?token=${token}`

    // send email
    const date = new Date()
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`

    const subject = `Link zur Anmeldung vom ${formattedDate}`

    let emailBody = `
        <html>
        <head>
            <style>
               body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                h1 {
                    color: #DBC70C;
                    text-align: center;
                    font-size: 16;
                    padding-top: 40px;
                    padding-bottom: 40px;
                }
                p {
                    color: #000;
                    font-size: 12;
                    text-align: center
                    padding-bottom: 30px;
                }
                a {
                    color: #DBC70C;
                    font-size: 12;
                    text-decoration: underline; 
                    text-align: center
                }
                a:hover {
                    color:rgb(50, 48, 48); 
                    text-decoration:underline; 
                    cursor:pointer;  
                }
            </style>
        </head>
        <body>
        <h1>Link zur Anmeldung - OdlH</h1>
        <p>Bitte klicken Sie auf diesen Link, um ihre einmalige anmeldung abzuschließen:<p>
        <a href="${link}"><b>Anmelden</b></a>
        </body>
        </html>
    `

    EmailService.sendHtmlMail(
        email,
        subject,
        emailBody
    )

    return link
}

async function singleLogin(token) {
    const email = await AuthModel.singleLogin(token)
    const advancedAuthUser = await AuthModel.findAdvancedAuthUserByEmail(email)

    //generate JWT token
    const jwt = generateJWTtoken(advancedAuthUser)
    //return user with out password and jwt token
    return {
        user: advancedAuthUser.getAuthUser(),
        jwt: jwt
    }
}

export default {
    getAuthUser,
    createUser,
    extractTokenAndVerify,
    verifyLoginInformation,
    verifyEmail,
    sendLoginMail,
    createAdmin,
    sendVerificationEmail,
    singleLogin,
}
