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

async function createWishlist(req, res) {
    const userId = req.user.id
    try {
        const { name, description } = req.body

        const wishlist = await WishlistService.createWishlist(
            userId,
            name,
            description
        )
        res.status(201).json({
            ...wishlist,
        })
    } catch (error) {
        console.log(
            `Failed createWishlist for user with id ${userId}; \Message: ${error?.message}; \nStack: ${error?.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

export default {
    getWishlistsByUserId,
    getWishlistById,
    createWishlist,
}
