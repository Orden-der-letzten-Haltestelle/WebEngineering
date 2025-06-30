import UserService from "../services/user.service.js"

async function deleteUser(req, res) {
    const userId = req.user.id
    //const userId = 10    //hardcoded for testing, as else you delete yourself with testing :)
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

async function bannUser(req, res) {
    const userId = req.params.userId
    //if user doesn't have roles, they can't return an AuthUser object, so there is an error, but user is still banned
    try {
        const response = await UserService.bannUser(userId)
        res.status(200).json([response])
    } catch (error) {
        console.log(
            `Failed bannUser for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function unBannUser(req, res) {
    const userId = req.params.userId
    //if user doesn't have roles, they can't return an AuthUser object, so there is an error, but user is still unbanned
    try {
        const response = await UserService.unBannUser(userId)
        res.status(200).json([response])
    } catch (error) {
        console.log(
            `Failed unBannUser for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

export default {
    deleteUser,
    bannUser,
    unBannUser,
}