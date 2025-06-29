import DbService from "../services/db.service.js"

async function testDbConnection(req, res) {
    try {
        console.log(process.env.DB_PASSWORD)
        const result = await DbService.testDbConnection()
        res.status(200).json({ connection: result ? `You are connected to DB` : "You are not connected to DB" })
    } catch (error) {
        console.log(
            `Failed Connection to DB:; ${error.stack}`
        )

        res.status(error.statusCode || 500).json({
            error: {
                message: error.message,
                stack: error.stack
            }
        })
    }
}

export default {
    testDbConnection
}