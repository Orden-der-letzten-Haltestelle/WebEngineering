//imports
import express from "express"
const router = express.Router()

//controlle
import AuthController from "../controllers/auth.controller.js"

/*
Hier wird einfach nur den verschieden Routes von Auth den Funktionen zugeordnet
*/

// define routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/protected", AuthController.authenticateJWT, (req, res) => {
    res.send("You have been granted access");
});

export default router
