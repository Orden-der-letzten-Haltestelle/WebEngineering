import express from "express"
import path from "path"
import { fileURLToPath } from "url"

// Import all routers
import ProductRouter from "./backend/src/routes/product.routes.js"
import AuthRouter from "./backend/src/routes/auth.routes.js"
import CartRouter from "./backend/src/routes/cart.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Endpoints
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"))
})

// Use the imported Routers
app.use("/api/products", ProductRouter)
app.use("/api/auth", AuthRouter)
app.use("/api/cart", CartRouter)

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`)
})
