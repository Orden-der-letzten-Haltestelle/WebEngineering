// Import
import AuthService from "../services/auth.service.js"

/**
 * Used for the responses and error handling
 * And Verify Inputs
 */

async function register(req, res) {
    try {
        const { username, password, email } = req.body;

        const user = await AuthService.createUser(username, password, email);

        res.writeHead(201, { "Content-Type": "text/plain" })
        res.end("User Created Successfully")
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const token = await AuthService.getTokenFromEmail(email, password);

        res.json(token)
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}

export default {
    register,
    login
}
