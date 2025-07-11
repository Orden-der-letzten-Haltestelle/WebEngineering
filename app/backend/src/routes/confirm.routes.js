//imports
import express from "express"
const router = express.Router()

//controlle
import ConfirmController from "../controllers/confirm.controller.js"

/*
Hier wird einfach nur den verschieden Routes von Products den Funktionen zugeordnet
*/

// define routes
router.get("/checkout/confirm", ConfrimController.confirmPage)

export default router
