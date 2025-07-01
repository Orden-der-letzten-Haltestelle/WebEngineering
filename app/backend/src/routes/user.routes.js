import express from "express"
const router = express.Router()

//controlle
import AuthController from "../controllers/auth.controller.js"
import UserController from "../controllers/user.controller.js"
import Roles from "../objects/user/Roles.js"

router.delete("/delete",
    AuthController.verifyJWTtoken(Roles.user),
    UserController.deleteUser
)
router.put("/:userId/bann",
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.bannUser
)
router.put("/:userId/unbann",
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.unBannUser
)
router.get("/",
    AuthController.verifyJWTtoken(Roles.user),
    UserController.getYourOwnUser
)
router.get("/:userId",
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.getUserById
)
router.put("/:userId/role/makeAdmin",
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.makeAdmin
)
router.put("/:userId/role/makeNoAdmin",
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.makeNoAdmin
)
export default router