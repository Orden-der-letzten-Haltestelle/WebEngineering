import express from "express"
const router = express.Router()

import CartController from "../controllers/cart.controllers.js"
import AuthController from "../controllers/auth.controller.js"
import Roles from "../objects/user/Roles.js"

router.get(
    "/",
    AuthController.verifyJWTtoken(Roles.user),
    CartController.getCart
)
router.post(
    "/buy",
    AuthController.verifyJWTtoken(Roles.user),
    CartController.buyCart
)
router.put(
    "/item/:cartItemId",
    AuthController.verifyJWTtoken(Roles.user),
    CartController.changeCartAmount
)
router.post(
    `/product/:productId`,
    AuthController.verifyJWTtoken(Roles.user),
    CartController.addProductToCart
)
router.delete(
    `/item/:cartItemId`,
    AuthController.verifyJWTtoken(Roles.user),
    CartController.deleteCartItem
)
router.delete(
    `/`,
    AuthController.verifyJWTtoken(Roles.user),
    CartController.deleteCart
)

export default router
