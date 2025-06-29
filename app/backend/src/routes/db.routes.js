import express from "express"
const router = express.Router()
import DbController from "../controllers/db.controller.js"

router.get("/test", DbController.testDbConnection)

export default router