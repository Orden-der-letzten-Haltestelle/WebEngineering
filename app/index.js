import express from "express"
import path from "path"
import { fileURLToPath } from "url"

// Import all routers
import ProductRouter from "./backend/src/routes/product.routes.js"
import AuthRouter from "./backend/src/routes/auth.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//allow all frontend files to be accessed by public
app.use(express.static(path.join(__dirname, "frontend")))

// frontend Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"))
})
app.get("/products", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "pages/products.html"))
})


// Backend routes
app.use("/api/products", ProductRouter)
app.use("/api/auth", AuthRouter)

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`)
})
