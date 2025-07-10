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

router.get("/hasAccess", AuthController.hasUserAccessToResource)
router.post("/register", AuthController.register)
router.post(
    "/registerAdmin",
    AuthController.verifyJWTtoken(Roles.admin),
    AuthController.registerAdmin
)

router.post("/login", AuthController.login)

router.post("/login/sendmail", AuthController.sendMail)

router.get(
    "/protected",
    AuthController.verifyJWTtoken(Roles.user),
    (req, res) => {
        res.send(
            `You have been granted access; userId: ${req.user.id}, roles: ${req.user.roles}`
        )
    }
)

router.put("/login/:token",
    AuthController.singleLogin
)

router.put("/verify/:token",
    AuthController.verifyEmail
)

router.post("/verify/sendMail",
    AuthController.sendVerifyMail
)

export default router
