//services
import AuthService from "./auth.service.js"
import ProductService from "./product.service.js"
import CartService from "./cart.service.js"
import OrderService from "./order.service.js"
import UserService from "./user.service.js"
import WishlistService from "./wishlist.service.js"

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
    const user = await AuthService.getAuthUser(userId)

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
                //TODO remove? wird das hier gehandelt???
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
                //when user not admin, and not owner of cartitem => no access
                if (
                    !user.hasRole(Roles.admin) &&
                    id != null &&
                    cartItem.ownerId !== user.id
                ) {
                    return false
                }
                return true
            case "PUT":
                //Put requires an resourceId
                if (id == null)
                    throw new BadRequestError(
                        `For CartItem ${action} a resourceId is required`
                    )
                //user has to own cartitem, admins should not be abel to change e.g. amount
                if (cartItem.ownerId !== user.id) {
                    return false
                }
            case "POST":
                if (id == null) {
                    //buy: you can always buy your own cart
                    return true
                }
            case "DELETE":
                //if id given, user has to own it. admins shoulnt be abel to remove this or add items to users cart
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

//TODO ??? wenn wir cartitem und orderitems zusammen machen,
// dann macht das garkein sinn, weil wir ja unterschiedliche post,put actions haben.
// aber irgendwie ist es ja die selbe resource, ich check das nicht....
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
            case "DELETE":
                throw new BadRequestError(
                    `You can't delete or edit your order history.`
                )
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
