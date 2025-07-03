//imports
import express from "express"
const router = express.Router()

//controlle
import AuthController from "../controllers/auth.controller.js"
import Roles from "../objects/user/Roles.js"

/*
Hier wird einfach nur den verschieden Routes von Auth den Funktionen zugeordnet
*/

// define routes
router.get(
    "/",
    AuthController.verifyJWTtoken(Roles.user),
    AuthController.getAuthUser
)
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.get("/hasAccess", AuthController.hasUserAccessToResource)

export default router
