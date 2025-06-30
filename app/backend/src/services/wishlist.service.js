import UserService from "./user.service.js"
import WishlistModel from "../models/wishlist.model.js"
import ProductValidator from "../validator/validator.product.js"

//objects
import BasicWishlist from "../objects/wishlist/BasicWishlist.js"
import Wishlist from "../objects/wishlist/Wishlist.js"
import WishlistItem from "../objects/items/WishlistItem.js"
import WishlistMember from "../objects/user/WishlistMember.js"
import WishlistRoles from "../objects/user/WishlistRoles.js"

//errors
import DatabaseError from "../exceptions/DatabaseError.js"
import ForbiddenError from "../exceptions/ForbiddenError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import ServerError from "../exceptions/ServerError.js"
import BadRequestError from "../exceptions/BadRequestError.js"

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
 * Returns a list of all wishlistItems, the given wishlist contains
 * @param {int} wishlistId
 * @returns {Promise<WishlistItem[]>}
 * @throws {DatabaseError}
 */
async function getWishlistItemsByWishlistId(wishlistId) {
    const wishlistItems = await WishlistModel.findWishlistItemsByWishlistId(
        wishlistId
    )
    return wishlistItems
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

async function getWishlistMembersByWishlistId(wishlistId) {
    return await WishlistModel.findWishlistMembersByWishlistId(wishlistId)
}

/**
 * Returns the basicwishlist with the given wishlist id and verifys,
 * that the given user is authorized to access this wishlist
 * @param {int} userId
 * @param {int} wishlistId
 * @returns {Promise<BasicWishlist>}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 * @throws {ForbiddenError}
 */
async function getBasicWishlistById(userId, wishlistId) {
    //verify required role
    await verifyWishlistRoleByWishlistId(userId, wishlistId, WishlistRoles.read)

    const wishlistMember = await getWishlistMemberByUserIdAndWishlistId(
        userId,
        wishlistId
    )
    const basicWishlist = await WishlistModel.findBasicWishlistByWishlistId(
        wishlistId
    )
    basicWishlist.member = wishlistMember
    return basicWishlist
}

/**
 * Returns the wishlistMember for a wishlist.
 * @param {int} userId
 * @param {int} wishlistId
 * @returns {Promise<WishlistMember>}
 * @throws {DatabaseError}
 * @throws {NotFoundError}
 */
async function getWishlistMemberByUserIdAndWishlistId(userId, wishlistId) {
    const wishlistMember =
        await WishlistModel.findWishlistMemberByUserIdAndWishlistId(
            userId,
            wishlistId
        )
    return wishlistMember
}

/**
 * Returns a wishlist by its id and user id, verifys, that a user is authorized to access this wishlist
 * @param {int} userId
 * @param {int} wishlistId
 * @returns {Promise<Wishlist>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 * @throws {ServerError}
 */
async function getWishlistById(userId, wishlistId) {
    //get all wishlist informations
    const basicWishlist = await getBasicWishlistById(userId, wishlistId)
    const wishlistMembers = await getWishlistMembersByWishlistId(wishlistId)
    console.log(wishlistMembers)
    const wishlistItems = await getWishlistItemsByWishlistId(wishlistId)

    //build full wishlist
    const wishlist = new Wishlist(
        basicWishlist.id,
        basicWishlist.name,
        basicWishlist.description,
        basicWishlist.member,
        wishlistMembers,
        wishlistItems
    )
    return wishlist
}

/**
 * Creates a new wishlist
 * @param {int} userId
 * @param {string} name
 * @param {string} description
 * @returns {Promise<BasicWishlist>}
 * @throws {DatabaseError}
 */
async function createWishlist(userId, name, description) {
    const wishlistId = await WishlistModel.createWishlist(
        userId,
        name,
        description
    )
    const basicWishlist = await getBasicWishlistById(userId, wishlistId)
    return basicWishlist
}

/**
 * Returns true or false, when a  product is already in the wishlist.
 * @param {int} productId 
 * @param {int} wishlistId 
 * @returns {Promise<boolean>}
 * @throws {DatabaseError}
 */

async function isProductInWishlist(productId, wishlistId) {
    try {
        //TODO make DB reuqest
        return true
    } catch (error) {
        if (error instanceof NotFoundError) {
            return false
        }
        throw error
    }
}

/**
 * Adds a product to the wishlist. Only when user has write access. 
 * When product already exists, then add amount to already existing one.
 * @param {int} userId 
 * @param {int} wishlistId 
 * @param {int} productId 
 * @param {int} amount
 * @returns {Promise<Wishlist>} 
 * @throws {DatabaseError} 
 * @throws {ForbiddenError}
 * @throws {BadRequestError}
 */
async function addProductToWishlist(userId, wishlistId, productId, amount) {
    //verify that user has access

    //proof, product not already in wishlist
    //when product already in wishlist, change amoun


    //proof, product has right amount
    await ProductValidator.isValidAmount(productId, amount)

    //return wishlist
    return await getWishlistById(userId, wishlistId)
}

export default { getWishlistById, getWishlistsByUserId, createWishlist }
