import WishlistRoles from "../objects/user/WishlistRoles";
import AuthService from "../services/auth.service";
import WishlistService from "../services/wishlist.service.js"

/**
 * Proofs, if the given user has the rights to access the wishlist
 * @param {string} userId 
 * @param {WishlistRoles} wishlistRole 
 */
async function verifyWishlistRole(userId, wishlistRole, wishlistId) {
    return async function (req, res, next) {
        try {
            const userId = req.user.id

<<<<<<< Updated upstream
            const res = 
=======
            const res = WishlistService.
>>>>>>> Stashed changes
        } catch (error) {
            console.log(`failed to verify wishlist Role; ${error.message}; ${error.stack}`)
            res.json({
                error: {
                    message: error.message,
                    stack: error.stack
                }
            })
        }
    }
}