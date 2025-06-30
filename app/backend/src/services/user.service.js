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

/**
 * deletes an User by the id, if no user with that id is found, an NotFoundError is thrown
 * @param {int} userId
 * @throws {NotFoundError}
 */
async function deleteUser(userId) {
    return await UserModel.deleteUserById(userId)
}

/**
 * banns an User by the id, if no user with that id is found, an NotFoundError is thrown
 * @param {int} userId
 * @throws {NotFoundError}
 */
async function bannUser(userId) {
    return await UserModel.bannUserById(userId)
}

/**
 * unbanns an User by the id, if no user with that id is found, an NotFoundError is thrown
 * @param {int} userId
 * @throws {NotFoundError}
 */
async function unBannUser(userId) {
    return await UserModel.unBannUserById(userId)
}

/**
 * gets an User by the id, if no user with that id is found, an NotFoundError is thrown
 * @param {int} userId
 * @throws {NotFoundError}
 */
async function getUserById(userId) {
    return await UserModel.getUserById(userId)
}

export default {
    getBasicUserById,
    deleteUser,
    bannUser,
    unBannUser,
    getUserById,
}
