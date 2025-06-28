import DatabaseError from "../exceptions/DatabaseError.js"
import ServerError from "../exceptions/ServerError.js"
import WishlistService from "../services/wishlist.service.js"

/**
 * Returns all wishlists, a user with the given userId has.
 * @param {*} req
 * @param {*} res
 * @throws {DatabaseError}
 * @throws {ServerError}
 */
async function getWishlistsByUserId(req, res) {
    const userId = req.user.id
    try {
        const wishlists = await WishlistService.getWishlistsByUserId(userId)
        res.status(200).json([...wishlists])
    } catch (error) {
        console.log(
            `failed to getWishlistsByUserId for user with id ${userId}; ${error.message}; ${error.stack}`
        )
        res.status(error?.statusCode || 500).json({
            message: error.message,
            stack: error.stack,
        })
    }
}

export default {
    getWishlistsByUserId,
}
