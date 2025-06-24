//imports
import express from "express"
const router = express.Router()

//controlle
import ProductController from "../controllers/product.controller.js"
import AuthController from "../controllers/auth.controller.js"
import Roles from "../objects/user/Roles.js"

/*
Hier wird einfach nur den verschieden Routes von Products den Funktionen zugeordnet
*/

// define routes
router.get(
    "/",
    ProductController.listProducts
)
router.post(
    "/",
    AuthController.verifyJWTtoken(Roles.admin),
    ProductController.createProduct
)
// router.get(
//     "/:productId",
//     ProductController.
// )
// router.put(
//     "/:productId",
//     AuthController.verifyJWTtoken(Roles.admin),
//     ProductController.
// )
// router.delete(
//     "/:productId",
//     AuthController.verifyJWTtoken(Roles.admin),
//     ProductController.
// )

export default router
