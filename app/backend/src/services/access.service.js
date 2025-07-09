//errors
import UnauthorizedError from "../exceptions/UnauthorizedError.js"
import AuthenticationError from "../exceptions/AuthenticationError.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import ServerError from "../exceptions/ServerError.js"
import BadRequestError from "../exceptions/BadRequestError.js"
import NotImplementedError from "../exceptions/NotImplementedError.js"
import Roles from "../objects/user/Roles.js"

/**
 * Admin should be abel to access this endpoint, to verify, if the user given with the id
 * can access the resource and perform that action.
 * @param {int} userId
 * @param {Roles} roles
 * @param {string} ressource
 * @param {string} action
 */
async function hasUserAccessToResource(userId, resourceId, ressource, action) {
    const user = await getAuthUser(userId)
    //if (user.hasRole(Roles.admin)) {
    //TODO should an admin be abel to delete a user
    //  return true
    //}

    //TODO proof, that valid action is given

    switch (ressource) {
        case "products":
            return await hasUserAccessToProduct(user, resourceId, action)
        //??? cartItems and orderItems are the same?? bc. in same table??
        case "cartItems":
            return await hasUserAccessToCartItem(user, resourceId, action)
        case "orderItems":
            return await hasUserAccessToOrderItem(user, resourceId, action)
        case "users":
            return await hasUserAccessToUser(user, resourceId, action)
        case "user_has_role":
            return await hasUserAccessToUser_Has_Role(user, resourceId, action)
        case "user_wishlist_realtion":
            return await hasUserAccessToUser_wishlist_relation(
                user,
                resourceId,
                action
            )
        case "wishlists":
            return await hasUserAccessToWishlist(user, resourceId, action)
        case "wishlistItems":
            //TODO
            return
        case "roles":
            return user.hasRole(Roles.admin)
        case "wishlistroles":
            return user.hasRole(Roles.admin)
    }
}

/**
 * Verify if the given user can make the given action.
 * if no productId is given, it test overall, if the user could make this request for any product.
 * When ProductId is given, we also trest, if the product exists
 *
 * @param {AuthUser} user
 * @param {int} productId
 * @param {string} action
 * @returns
 * @throws {ServerError}
 */
async function hasUserAccessToProduct(user, productId, action) {
    try {
        switch (action) {
            case "GET":
                //when productId given, product needs to exist
                if (productId != null) {
                    await ProductService.getProductById(productId)
                }
                return true
            case "POST":
            case "PUT":
            case "DELETE":
                //product needs to be given and needs to exist
                if (productId == null || productId == undefined)
                    throw new BadRequestError(
                        `For ${action} Product an resourceId is required.`
                    )
                await ProductService.getProductById(productId)

                //user needs to be admin
                return user.hasRole(Roles.admin)
            default:
                return false
        }
    } catch (error) {
        if (
            error instanceof NotFoundError ||
            error instanceof DatabaseError ||
            error instanceof BadRequestError
        ) {
            throw error
        }
        throw new ServerError(
            "Failed proofing, if user has access to product.",
            { originalError: error }
        )
    }
}

/**
 * Verifys if an user can access the cartitem.
 *
 * @param {int} user
 * @param {int} cartItemId
 * @param {string} action
 */
async function hasUserAccessToCartItem(user, id, action) {
    //if id given, item has to exist
    let cartItem = undefined
    if (id != null) {
        cartItem = await CartService.getCartItem(id)
    }

    try {
        switch (action) {
            case "GET":
                //when id given, user needs to be owner
                if (id != null && cartItem.ownerId !== user.id) {
                    return false
                }
                return true
            case "PUT":
                //Put requires an resourceId
                if (id == null)
                    throw new BadRequestError(
                        `For CartItem ${action} a resourceId is required`
                    )
            case "POST":
            case "DELETE":
                //User has to be owner of CartItem
                if (cartItem != undefined && cartItem.ownerId !== user.id)
                    return false
                return true
            default:
                throw new NotImplementedError(`${action} isn't supported`)
        }
    } catch (error) {
        if (
            error instanceof NotFoundError ||
            error instanceof DatabaseError ||
            error instanceof BadRequestError ||
            error instanceof NotImplementedError
        ) {
            throw error
        }
        console.log(error)
        throw new ServerError(
            "Failed proofing, if user has access to cartItem.",
            { originalError: error }
        )
    }
}

async function hasUserAccessToOrderItem(user, id, action) {
    try {
        //if id given, item has to exist
        let item = undefined
        if (id != null) {
            item = await CartService.getOrderItem(id)
        }

        switch (action) {
            case "GET":
                //when id given, user needs to be owner
                if (id != null && item.ownerId !== user.id) {
                    return false
                }
                return true
            case "POST":
                if (id != null) {
                    //Post request with given id isnt Supported.
                    throw new NotImplementedError(
                        `${action} Request with resourceId isn't supported for OrderItems`
                    )
                }
                //user can always buy his own cart
                return true
            case "PUT":
                if (id == null) {
                    throw new BadRequestError(
                        `${action} Requires an resourceId.`
                    )
                }
                //when given, user has to own item
                if (item.ownerId !== user.id) {
                    return false
                }
            case "DELETE":
                return false
            default:
                throw NotImplementedError(`${action} isnt Supported.`)
        }
    } catch (error) {
        if (
            error instanceof NotFoundError ||
            error instanceof DatabaseError ||
            error instanceof BadRequestError ||
            error instanceof NotImplementedError
        ) {
            throw error
        }
        throw new ServerError("Failed proofing hasUserAccessToOrderItem")
    }
}

async function hasUserAccessToUser(user, id, action) {
    try {
        let item = undefined
        if (id != null) {
            item = await getAuthUser(id)
        }

        if (id != null && user.hasRole(Roles.admin)) {
            return false
        }

        switch (action) {
            case "GET":
            case "PUT":
            case "POST":
                //Admins and my self can access those endpoints.
                return true
            case "DELETE":
                if (user.id != id) {
                    //no one other then myself, should be abel to delete that user
                    return false
                }
                return true
        }
    } catch (error) {
        if (
            error instanceof NotFoundError ||
            error instanceof DatabaseError ||
            error instanceof BadRequestError ||
            error instanceof NotImplementedError
        ) {
            throw error
        }
        throw new ServerError("Failed proofing hasUserAccessToUser")
    }
}

async function hasUserAccessToUser_Has_Role(user, id, action) {
    try {
        //only admins can edit roles
        switch (action) {
            case "GET":
            case "PUT":
            case "POST":
            case "DELETE":
                return user.hasRole(Roles.admin)
        }
    } catch (error) {
        if (
            error instanceof NotFoundError ||
            error instanceof DatabaseError ||
            error instanceof BadRequestError ||
            error instanceof NotImplementedError
        ) {
            throw error
        }
        throw new ServerError("Failed proofing hasUserAccessToUser_Has_Role")
    }
}

async function hasUserAccessToUser_wishlist_relation(user, id, action) {
    try {
        //if post, we get wishlistId
        //if not, we get user_wishlist_relationId

        switch (action) {
            case "GET":
            case "PUT":
            case "POST":
                //everyone can post
                user.hasRole(Roles.user)
            case "DELETE":
            //only owner can delete
        }
    } catch (error) {
        if (
            error instanceof NotFoundError ||
            error instanceof DatabaseError ||
            error instanceof BadRequestError ||
            error instanceof NotImplementedError
        ) {
            throw error
        }
        throw new ServerError("Failed proofing hasUserAccessToUser_Has_Role")
    }
}

export default { hasUserAccessToResource }
