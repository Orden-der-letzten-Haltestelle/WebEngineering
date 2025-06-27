import express from "express"
const router = express.Router()

//controlle
import AuthController from "../controllers/auth.controller.js"
import Roles from "../objects/user/Roles.js"
router.delete("/user/delete/:userId",
    AuthController.verifyJWTtoken(Roles.user),
    AuthController.deleteUser
)
export default router