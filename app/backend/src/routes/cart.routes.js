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

export default router
