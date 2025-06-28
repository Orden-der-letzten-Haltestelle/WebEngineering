import WishlistRoles from "../objects/user/WishlistRoles.js"
import UserService from "./user.service.js"
import WishlistModel from "../models/wishlist.model.js"
import WishlistMember from "../objects/user/WishlistMember.js"

import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import ForbiddenError from "../exceptions/ForbiddenError.js"
import WishlistItem from "../objects/items/WishlistItem.js"
import ServerError from "../exceptions/ServerError.js"

/**
 * Returns an WishlistMember by userId and wishlistId.
 * @param {int} userId
 * @param {int} wishlistId
 * @returns {Promise<WishlistMember>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function getWishlistMemberByUserIdAndWishlistId(userId, wishlistId) {
    const member = WishlistModel.findWishlistMemberByUserIdAndWishlistId(
        userId,
        wishlistId
    )
    return member
}

/**
 * Returns a WishlistItem by its id
 * @param {int} wishlistItemId
 * @returns {Promise<WishlistItem>}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 */
async function getWishlistItemById(wishlistItemId) {
    const wishlistItem = WishlistModel.findWishlistItemById(wishlistItemId)
    return wishlistItem
}

/**
 * Verifys, that the given user has the requiredRole on the wishlist
 * @param {int} userId
 * @param {int} wishlistId
 * @param {WishlistRoles} requiredWishlistRole
 * @returns {Promise}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 * @throws {ForbiddenError}
 */
async function verifyWishlistRoleByWishlistId(
    userId,
    wishlistId,
    requiredWishlistRole
) {
    const member = await getWishlistMemberByUserIdAndWishlistId(
        userId,
        wishlistId
    )
    if (!member.hasRole(requiredWishlistRole)) {
        throw new ForbiddenError(
            `User with the id ${userId} hasnt ${requiredWishlistRole.roleName} for the wishlist with id ${wishlistId}`
        )
    }
}

/**
 * verifys, that the given user has the requiredRole for the wishlistitem
 * @param {int} userId
 * @param {int} wishlistItemId
 * @param {WishlistRoles} requiredWishlistRole
 * @returns {Promise}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 * @throws {ForbiddenError}
 */
async function verifyWishlistRoleByWishlistItemId(
    userId,
    wishlistItemId,
    requiredWishlistRole
) {
    const wishlistId = await getWishlistItemById(wishlistItemId)
    await verifyWishlistRoleByWishlistId(
        userId,
        wishlistId,
        requiredWishlistRole
    )
}

/**
 * Returns all Wishlists, a user is member of.
 * @param {int} userId
 * @returns {Promise<BasicWishlist[]>}
 * @throws {DatabaseError}
 * @throws {ServerError}
 */
async function getWishlistsByUserId(userId) {
    return await WishlistModel.findWishlistsByUserId(userId)
}

export default { getWishlistsByUserId }
