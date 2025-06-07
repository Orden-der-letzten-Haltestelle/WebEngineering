// Import
import UnauthorizedError from "../exceptions/UnauthorizedError.js"
import AuthService from "../services/auth.service.js"

/**
 * Used for the responses and error handling
 * And Verify Inputs
 */

/**
 * Verify given JWT token and return user Information
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function verifyJWTtoken(req, res, next) {
    try {
        const token = req.headers.authorization

        //when token empty, throw 401
        if (!token) {
            throw new UnauthorizedError()
        }

        //proof token and extract information form token
        const user = await AuthService.getUserInformationByJWTtoken(token)
        req.user = user
        next() //move to the next step
    } catch (error) {
        console.log(`failed to verify jwt token; ${error.message}`)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
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
