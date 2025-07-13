import UserService from "../services/user.service.js"

async function deleteUser(req, res) {
    const userId = req.user.id
    try {
        const response = await UserService.deleteUser(userId)

        const data = JSON.stringify(response)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        console.log(
            `Failed delete user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function deleteUserbyId(req, res) {
    const userId = req.params.userId
    try {
        const response = await UserService.deleteUser(userId)

        const data = JSON.stringify(response)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        console.log(
            `Failed delete user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function bannUser(req, res) {
    const userId = req.params.userId
    //if user doesn't have roles, they can't return an AuthUser object, so there is an error, but user is still banned
    try {
        const response = await UserService.bannUser(userId)
        res.status(200).json(response)
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
        res.status(200).json(response)
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

async function getUserById(req, res) {
    const userId = req.params.userId
    try {
        const response = (await UserService.getUserById(userId)).getDAO()
        res.status(200).json(response)
    } catch (error) {
        console.log(
            `Failed getUserById for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function getYourOwnUser(req, res) {
    const userId = req.user.id
    try {
        const response = (await UserService.getUserById(userId)).getDAO()
        res.status(200).json(response)
    } catch (error) {
        console.log(
            `Failed getYourOwnUser for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function makeAdmin(req, res) {
    const userId = req.params.userId
    try {
        const response = await UserService.makeAdmin(userId)
        res.status(200).json(response)
    } catch (error) {
        console.log(
            `Failed makeAdmin for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function makeNoAdmin(req, res) {
    const userId = req.params.userId
    try {
        const response = await UserService.makeNoAdmin(userId)
        res.status(200).json(response)
    } catch (error) {
        console.log(
            `Failed makeNoAdmin for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function getUserByMail(req, res) {
    const email = req.params.mailaddress
    try {
        const response = await UserService.getUserByMail(email)
        res.status(200).json(response)
    } catch (error) {
        console.log(
            `Failed to get User with email: ${email}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function getAllUsers(req, res) {
    try {
        const response = await UserService.getAllUsers()
        res.status(200).json(response)
    } catch (error) {
        console.log(
            `Failed to get all users; \nMessage: ${error.message}; \nStack: ${error.stack}`
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
    deleteUserbyId,
    bannUser,
    unBannUser,
    getUserById,
    getYourOwnUser,
    makeAdmin,
    makeNoAdmin,
    getUserByMail,
    getAllUsers,
}
