import WishlistRoles from "../objects/user/WishlistRoles";
import AuthService from "../services/auth.service";
import WishlistService from "../services/wishlist.service.js"

/**
 * Returns all wishlists, a user with the given userId has.
 * @param {int} userId 
 * @param {P} wishlistRole 
 */
async function getWishlistsByUserId(req, res) {
    try {
        const userId = req.user.id
        await WishlistService.verifyWishlistRoleByWishlistId()
    } catch (error) {
        console.log(`failed to getWishlistsByUserId for user with id ${userId}; ${error.message}; ${error.stack}`)
        res.json({
            message: error.message,
            stack: error.stack
        })
    }
}