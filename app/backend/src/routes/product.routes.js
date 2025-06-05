//imports
import express from "express"
const router = express.Router()

//controlle
import ProductController from "../controllers/product.controller.js"

/*
Hier wird einfach nur den verschieden Routes von Products den Funktionen zugeordnet
*/

// define routes
router.get("/", ProductController.listProducts)

export default router
