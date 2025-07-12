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
    AuthController.verifyNotSame,
    UserController.bannUser
)
router.put("/:userId/unbann",
    AuthController.verifyJWTtoken(Roles.admin),
    AuthController.verifyNotSame,
    UserController.unBannUser
)
router.get("/",
    AuthController.verifyJWTtoken(Roles.user),
    UserController.getYourOwnUser
)
router.get("/byId/:userId",                     //had to change endpoint because of conflict with getAllUsers
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.getUserById
)
router.put("/:userId/role/makeAdmin",
    AuthController.verifyJWTtoken(Roles.admin),
    AuthController.verifyNotSame,
    UserController.makeAdmin
)
router.put("/:userId/role/makeNoAdmin",
    AuthController.verifyJWTtoken(Roles.admin),
    AuthController.verifyNotSame,
    UserController.makeNoAdmin
)
router.get("/userByMail/:mailaddress",
    AuthController.verifyJWTtoken(Roles.user),
    UserController.getUserByMail
)
router.get("/allUsers",
    AuthController.verifyJWTtoken(Roles.admin),
    UserController.getAllUsers
)
export default router