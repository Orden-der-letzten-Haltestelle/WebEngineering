import UserService from "../services/user.service.js"

async function deleteUser(req, res) {
    //const userId = req.user.id
    const userId = 9
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

export default {
    deleteUser,
}