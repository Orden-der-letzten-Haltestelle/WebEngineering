// Import
import UnauthorizedError from "../exceptions/UnauthorizedError.js"
import AuthService from "../services/auth.service.js"
import ForbiddenError from "../exceptions/ForbiddenError.js"
import Roles from "../objects/user/Roles.js"

/**
 * Used for the responses and error handling
 * And Verify Inputs
 */

/**
 * Verify given JWT token and puts User information in req.user.
 * can be put in front of other requests, to verify the user.
 *
 * This function takes an requiredRole as parameter,
 * it will test if the jwt token has the required role. When not it will throw 403
 * If you don't need the role provement, just let requiredRole === undefined, then it will not test for anyrole
 *
 * @param {Roles} requiredRole
 * @returns {function}
 * @throws {UnauthorizedError}
 * @throws {ForbiddenError}
 */
function verifyJWTtoken(requiredRole) {
    return async function (req, res, next) {
        try {
            const token = req.headers.authorization

            //when token empty, throw 401
            if (!token) {
                throw new UnauthorizedError()
            }

            //proof token and extract information form token
            const user = await AuthService.getUserInformationByJWTtoken(token)

            //check if the user has the required role
            if (
                requiredRole !== undefined &&
                (!user.roles || !user.roles.includes(requiredRole.roleName))
            ) {
                throw new ForbiddenError()
            }

            //store user information in req, so it can be used in next steps
            req.user = user

            //move to the next step
            next()
        } catch (error) {
            console.log(`failed to verify jwt token; ${error.message}`)
            res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
            res.end(
                error.stack + (error.cause ? "\n\n[cause] " + error.cause : "")
            )
        }
    }
}

async function register(req, res) {
    try {
        const { username, password, email } = req.body

        const userAndToken = await AuthService.createUser(
            username,
            password,
            email
        )

        console.log(`Signed up Successfully, with id ${userAndToken.user.id}`)
        res.status(201).json({
            ...userAndToken,
        })
    } catch (error) {
        console.log(`Failed sign up; ${error.message}`)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

async function login(req, res) {
    const { email, password } = req.body
    try {
        const userAndToken = await AuthService.verifyLoginInformation(
            email,
            password
        )
        console.log(`User with email ${email}, successfully signed in`)
        res.json({
            ...userAndToken,
        })
    } catch (error) {
        console.log(
            `User with email ${email}, failed sign in; ${error.message}`
        )
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

export default {
    register,
    login,
    verifyJWTtoken,
}
