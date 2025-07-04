import express from "express"
import ejs from "ejs"
import path from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"

// Import all routers
import ProductRouter from "./backend/src/routes/product.routes.js"
import AuthRouter from "./backend/src/routes/auth.routes.js"
import CartRouter from "./backend/src/routes/cart.routes.js"
import UserRouter from "./backend/src/routes/user.routes.js"
import DbRouter from "./backend/src/routes/db.routes.js"

//frontend router
import FrontendRouter from "./frontend/frontend.index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

//add cookie parser
app.use(cookieParser())

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//allow all frontend files to be accessed by public
app.use(express.static(path.join(__dirname, "frontend")))

//setup view engine ejs
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "frontend"))

// frontend Routes
app.use("/", FrontendRouter)

// Backend routes
app.use("/api/products", ProductRouter)
app.use("/api/auth", AuthRouter)
app.use("/api/cart", CartRouter)

app.use("/api/user", UserRouter)

app.use("/api/db", DbRouter)

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`)
})
