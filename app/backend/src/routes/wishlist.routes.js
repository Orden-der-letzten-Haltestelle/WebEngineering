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


export default router