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

async function getWishlistById(req, res) {
    const userId = req.user.id
    const wishlistId = req.params.wishlistId
    try {
        const wishlist = await WishlistService.getWishlistById(
            userId,
            wishlistId
        )
        res.status(200).json({ ...wishlist })
    } catch (error) {
        console.log(
            `failed to getWishlistById for user with id ${userId} and wishlistId ${wishlistId}; ${error.message}; ${error.stack}`
        )
        res.status(error?.statusCode || 500).json({
            message: error.message,
            stack: error.stack,
        })
    }
}

export default {
    getWishlistsByUserId,
    getWishlistById,
}
