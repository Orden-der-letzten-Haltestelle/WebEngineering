import BadRequestError from "../exceptions/BadRequestError.js"
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
        const { name = "", description = "" } = req.body

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

async function addProductToWishlist(req, res) {
    const userId = req.user.id
    const wishlistId = req.params.wishlistId
    const productId = req.params.productId

    try {
        const amount = req.query?.amount || 1

        const wishlist = await WishlistService.addProductToWishlist(
            userId,
            wishlistId,
            productId,
            amount
        )
        res.status(201).json({
            ...wishlist,
        })
    } catch (error) {
        console.log(
            `Failed addProductToWishlist for user with id ${userId}, wishlistId: ${wishlistId}, productId ${productId}; \Message: ${error?.message}; \nStack: ${error?.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function updateWishlist(req, res) {
    const userId = req.user.id
    const wishlistId = req.params.wishlistId
    try {
        const { name = "", description = "" } = req.body

        const wishlist = await WishlistService.updateWishlist(
            userId,
            wishlistId,
            name,
            description
        )
        res.status(200).json({
            ...wishlist,
        })
    } catch (error) {
        console.log(
            `Failed updateWishlist for user with id ${userId}; \Message: ${error?.message}; \nStack: ${error?.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function addUserToWishlist(req, res) {
    const ownerId = req.user.id
    const wishlistId = req.params.wishlistId
    try {
        const { userId = "", roleLevel = "" } = req.body

        const wishlist = await WishlistService.addUserToWishlist(
            ownerId,
            wishlistId,
            userId,
            roleLevel
        )

        res.status(201).json({
            ...wishlist,
        })
    } catch (error) {
        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function changeRoleOfUser(req, res) {
    const ownerId = req.user.id
    const relationId = req.params.userWishlistRelationId
    try {
        const { roleLevel = "" } = req.body

        const wishlist = await WishlistService.changeRoleOfRelation(
            ownerId,
            relationId,
            roleLevel
        )

        res.status(200).json({
            ...wishlist,
        })
    } catch (error) {
        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function deleteUserFromWishlist(req, res) {
    const ownerId = req.user.id
    const relationId = req.params.userWishlistRelationId
    try {
        const wishlist = await WishlistService.deleteRelationFromWishlist(
            ownerId,
            relationId
        )

        res.status(200).json({
            ...wishlist,
        })
    } catch (error) {
        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function deleteWishlistitem(req, res) {
    const userId = req.user.id
    const wishlistitemId = req.params.wishlistitemId
    try {
        const wishlist = await WishlistService.deleteWishlistitem(
            userId,
            wishlistitemId
        )

        res.status(200).json({
            ...wishlist,
        })
    } catch (error) {
        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function deleteWishlist(req, res) {
    const ownerId = req.user.id
    const wishlistId = req.params.wishlistId
    try {
        const wishlist = await WishlistService.deleteWishlist(
            ownerId,
            wishlistId
        )

        res.status(200).json({
            ...wishlist,
        })
    } catch (error) {
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
    addProductToWishlist,
    updateWishlist,
    addUserToWishlist,
    changeRoleOfUser,
    deleteUserFromWishlist,
    deleteWishlistitem,
    deleteWishlist,
}
