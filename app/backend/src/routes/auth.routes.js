//imports
import express from "express"
const router = express.Router()

//controlle
import AuthController from "../controllers/auth.controller.js"

/*
Hier wird einfach nur den verschieden Routes von Auth den Funktionen zugeordnet
*/

// define routes
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)

export default router
