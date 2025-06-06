// Import
import AuthService from "../services/auth.service.js"
import DatabaseError from "../exceptions/DatabaseError.js"

// Import other
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const SECRET_KEY = 'your-secret-key'; // In production, use environment variables

/*

*/

async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        const user = await AuthService.createUser(username, password, email);
        res.writeHead(201, { "Content-Type": "text/plain" })
        res.end("User Created Successfully" + user)
    } catch (error) {
        console.error(error)
        console.error(req.body)
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await AuthService.getUserByEmail(email);
        if (!user) {
            res.writeHead(404, { "Content-Type": "text/plain" })
            res.end(`User ${email} not found`)
        }
        // TO DO: correct Password
        if (bcrypt.compareSync(password, user.password)) {
            // TO DO: JWT
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.writeHead(401, { "Content-Type": "text/plain" })
            res.end("Invalid credentials")
        }
    } catch (error) {
        console.error(error)
        console.error(req.body)
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
    }
}

export default {
    register,
    login
}
