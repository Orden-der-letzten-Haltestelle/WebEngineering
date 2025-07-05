import express from "express"
const router = express.Router()

import AuthController from "../controllers/auth.controller.js"
import WishlistController from "../controllers/wishlist.controller.js"
import Roles from "../objects/user/Roles.js"

router.get(
    "/",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.getWishlistsByUserId
)

router.get(
    "/:wishlistId",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.getWishlistById
)

router.post(
    "/",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.createWishlist
)

router.put(
    "/:wishlistId",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.updateWishlist
)

router.post(
    "/:wishlistId/product/:productId",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.addProductToWishlist
)

router.post(
    "/:wishlistId/permission",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.addUserToWishlist
)

router.put(
    "/permission/:userWishlistRelationId",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.changeRoleOfUser
)

router.delete(
    "/permission/:userWishlistRelationId",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.deleteUserFromWishlist
)

router.delete(
    "/item/:wishlistitemId",
    AuthController.verifyJWTtoken(Roles.user),
    WishlistController.deleteWishlistitem
)

export default router
