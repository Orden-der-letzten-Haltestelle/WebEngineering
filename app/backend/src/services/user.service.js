import NotFoundError from "../exceptions/NotFoundError.js"
import BasicUser from "../objects/user/BasicUser.js"
import UserModel from "../models/user.model.js"

/**
 * Returns an BasicUser by the id, if no user with that id is found, an NotFoundError is thrown
 * @param {int} userId
 * @returns {Promise<BasicUser>}
 * @throws {NotFoundError}
 */
async function getBasicUserById(userId) {
    return await UserModel.findBasicUserById(userId)
}

export default {
    getBasicUserById,
}
