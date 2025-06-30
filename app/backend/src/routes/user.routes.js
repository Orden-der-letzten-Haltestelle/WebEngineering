import express from "express"
const router = express.Router()

//controlle
import AuthController from "../controllers/auth.controller.js"
import UserController from "../controllers/user.controller.js"
import Roles from "../objects/user/Roles.js"

router.delete("/delete/:userId",
    AuthController.verifyJWTtoken(Roles.user),
    UserController.deleteUser
)
router.put("/:userId/bann",
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.bannUser
)
export default router