import DbModel from "../models/db.model.js"

async function testDbConnection() {
    return DbModel.testDbConnection()
}

export default { testDbConnection }