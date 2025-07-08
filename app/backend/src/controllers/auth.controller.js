// Import
import AuthService from "../services/auth.service.js"
import Roles from "../objects/user/Roles.js"

/**
 * Used for the responses and error handling
 * And Verify Inputs
 */

/**
 * Handles endpoint to return personal user information
 * @param {*} req
 * @param {*} res
 */
async function getAuthUser(req, res) {
    try {
        const userId = req.user.id

        const authUser = await AuthService.getAuthUser(userId)

        res.status(200).json({
            ...authUser,
        })
    } catch (error) {
        console.log(
            `Failed getAuthUser; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

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
            const user = await AuthService.extractTokenAndVerify(
                token,
                requiredRole
            )

            //store user information in req, so it can be used in next steps
            req.user = user

            //move to the next step
            next()
        } catch (error) {
            console.log(`failed to verify jwt token; ${error.message}`)

            const statusCode = error?.statusCode || 500
            res.status(statusCode).json({
                message: error?.message || "Unexpected Error",
                stack: error?.stack,
            })
        }
    }
}

async function register(req, res) {
    const { username, password, email } = req.body
    try {
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
        console.log(
            `Failed sign up with email ${email}; \Message: ${error?.message}; \nStack: ${error?.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
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
            `Failed Login with email ${email}; \nMessage: ${error?.message}; \nStack: ${error?.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function verifyEmail(req, res) {
    const email = req.email
    const token = req.params.token
    try {
        const userVerified = await AuthService.verifyEmail(
            email,
            token
        )
        console.log(`User with the email ${email}, successfully verified`)
        res.json({
            ...userVerified,
        })
    } catch (error) {
        console.log(
            `Failed verification with email ${email}; \nMessage: ${error?.message}; \nStack: ${error?.stack}`
        )
        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function sendMail(req, res) {
    const { email } = req.body
    try {
        const result = await AuthService.sendLoginMail(email)

        res.json({
            email: email,
            link: result
        })
    } catch (error) {
        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function loginWithToken(req, res) {
    const { token } = req.query
    try {
        const result = await AuthService.loginWithToken(token)

        res.json({
            ...result
        })
    } catch (error) {
        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

export default {
    getAuthUser,
    register,
    login,
    verifyJWTtoken,
    verifyEmail,
    sendMail,
    loginWithToken,
}
