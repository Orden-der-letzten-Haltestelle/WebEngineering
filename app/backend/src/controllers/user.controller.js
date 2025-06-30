import UserService from "../services/user.service.js"
import BadRequestError from "../exceptions/BadRequestError.js"


async function deleteUser(req, res) {
    //const userId = req.user.id
    const userId = 34
    try {
        const response = await UserService.deleteUser(userId)

        const data = JSON.stringify(response)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}
async function deleteCart(req, res) {
    const userId = req.user.id
    try {
        await CartService.deleteCart(userId)
        res.status(200).json()
    } catch (error) {
        console.log(`Failed Deleting Cart for user with id ${userId}: ${error.stack}`)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

export default {
    deleteUser,
}