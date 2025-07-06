import UserService from "./user.service.js"
import WishlistModel from "../models/wishlist.model.js"
import WishlistItemModel from "../models/wishlistitem.model.js"
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
import Roles from "../objects/user/Roles.js"

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
    const wishlistItems = await WishlistItemModel.findWishlistItemsByWishlistId(
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
    try {
        const member = await getWishlistMemberByUserIdAndWishlistId(
            userId,
            wishlistId
        )
        if (!member.hasRole(requiredWishlistRole)) {
            throw new ForbiddenError(
                `You are not allowed to make this action for the wishlist with the id ${wishlistId}, you need to at least the role ${requiredWishlistRole.roleName} `
            )
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw new ForbiddenError(
                `You are not allowed to make this action for the wishlist with the id ${wishlistId}`
            )
        }
        throw error
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
 * Proofs if an product already exist in the given wishlist. if not, it returns true, when it does exist, it will return
 * the WishlistItem
 * @param {int} productId
 * @param {int} wishlistId
 * @returns {Promise<WishlistItem | boolean>}
 * @throws {DatabaseError}
 */
async function isProductInWishlist(productId, wishlistId) {
    try {
        const wishlistItem =
            await WishlistItemModel.findByProductIdAndWishlistId(
                productId,
                wishlistId
            )
        return wishlistItem
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
    //TODO
    //verify that user has access
    await verifyWishlistRoleByWishlistId(
        userId,
        wishlistId,
        WishlistRoles.write
    )

    //proof, product not already in wishlist | return, when it already exist
    const wishlistItem = await isProductInWishlist(productId, wishlistId)

    //proof, product has right amount
    await ProductValidator.isValidAmount(productId, amount)

    //create wishlist or update amount
    if (wishlistItem) {
        await WishlistItemModel.updateWishlistItem(
            wishlistId,
            productId,
            amount
        )
    } else {
        //create new wishlist item
        await WishlistItemModel.createWishlistItem(
            wishlistId,
            productId,
            amount
        )
    }

    //return wishlist
    return await getWishlistById(userId, wishlistId)
}

async function updateWishlist(userId, wishlistId, name, description) {
    //verify that user has access
    await verifyWishlistRoleByWishlistId(
        userId,
        wishlistId,
        WishlistRoles.write
    )

    await WishlistModel.updateWishlist(wishlistId, name, description)

    return await getWishlistById(userId, wishlistId)
}

async function addUserToWishlist(ownerId, wishlistId, userId, roleLevel) {
    await verifyWishlistRoleByWishlistId(
        ownerId,
        wishlistId,
        WishlistRoles.owner
    )

    // Check if Data is correct
    if (userId == "" || roleLevel == "") {
        throw new BadRequestError(
            `Your Request is not complete. Fill out both userId and roleLevel. Recieved: userId:${userId}, roleLevel:${roleLevel}`
        )
    }

    // Check if roleLevel is valide
    if (!(roleLevel == "1" || roleLevel == "2")) {
        throw new BadRequestError(
            `You need to use a proper roleLevel. Recieved: roleLevel:${roleLevel}, but need to be ether 1 (read) or 2 (write)`
        )
    }

    await WishlistModel.addUserToWishlist(wishlistId, userId, roleLevel)

    return await getWishlistById(ownerId, wishlistId)
}

async function changeRoleOfRelation(ownerId, relationId, roleLevel) {
    // Check if roleLevel is valide
    if (!(roleLevel == "1" || roleLevel == "2")) {
        throw new BadRequestError(
            `You need to use a proper roleLevel. Recieved: roleLevel:${roleLevel}, but need to be ether 1 (read) or 2 (write)`
        )
    }

    // Get the wishlistId
    const { wishlistid, wishlistroleid } = await WishlistModel.getRelationById(
        relationId
    )

    await verifyWishlistRoleByWishlistId(
        ownerId,
        wishlistid,
        WishlistRoles.owner
    )
    console.log("here")

    if (wishlistroleid != 1) {
        // If role is not owner
        await WishlistModel.changeRoleOfRelation(relationId, roleLevel)
    }

    return await getWishlistById(ownerId, wishlistid)
}

async function deleteRelationFromWishlist(ownerId, relationId) {
    const { wishlistid, wishlistroleid } = await WishlistModel.getRelationById(
        relationId
    )

    await verifyWishlistRoleByWishlistId(
        ownerId,
        wishlistid,
        WishlistRoles.owner
    )

    // Check if you want to delete the owner (yourself)
    // Should not be possible
    if (wishlistroleid != 1) {
        // If role is not admin
        await WishlistModel.deleteRelationFromWishlist(relationId)
    }

    return await getWishlistById(ownerId, wishlistid)
}

async function deleteWishlistitem(userId, wishlistitemId) {
    const { wishlistId } = await WishlistItemModel.findWishlistItemById(
        wishlistitemId
    )

    await verifyWishlistRoleByWishlistId(
        userId,
        wishlistId,
        WishlistRoles.write
    )

    await WishlistItemModel.deleteWishlistitem(wishlistitemId)

    return await getWishlistById(userId, wishlistId)
}

async function deleteWishlist(ownerId, wishlistId) {
    await verifyWishlistRoleByWishlistId(
        ownerId,
        wishlistId,
        WishlistRoles.owner
    )

    await WishlistModel.deleteWishlist(wishlistId)

    return
}

export default {
    getWishlistById,
    getWishlistsByUserId,
    createWishlist,
    addProductToWishlist,
    updateWishlist,
    addUserToWishlist,
    changeRoleOfRelation,
    deleteRelationFromWishlist,
    deleteWishlistitem,
    deleteWishlist,
}
