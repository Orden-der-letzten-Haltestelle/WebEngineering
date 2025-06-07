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
        const [information] = await AuthService.getUserInformationByJWTtoken(
            token
        )
        next() //move to the next step
    } catch (error) {
        console.error(error.stack)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

async function register(req, res) {
    try {
        const { username, password, email } = req.body

        const [user, token] = await AuthService.createUser(
            username,
            password,
            email
        )

        res.writeHead(201, { "Content-Type": "text/plain" })
        res.json({
            user: user,
            token: token,
        })
        res.end("User Created Successfully")
    } catch (error) {
        console.error(error.stack)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body

        const [user, token] = await AuthService.verifyLoginInformation(
            email,
            password
        )

        res.json({
            token: token,
            user: user,
        })
    } catch (error) {
        console.error(error.stack)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

export default {
    register,
    login,
    verifyJWTtoken,
}
