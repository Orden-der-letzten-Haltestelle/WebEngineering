import express from "express"
import ejs from "ejs"
import path from "path"
import { fileURLToPath } from "url"

//page loader
import CartPageLoader from "./pages/cart/CartPage.js"
import CheckoutPageLoader from "./pages/checkout/CheckoutPage.js"
import LoginPageLoader from "./pages/login/LoginPage.js"
import OrderPageLoader from "./pages/orders/OrderPage.js"
import RegisterPageLoader from "./pages/register/RegisterPage.js"
import WishlistPageLoader from "./pages/wishlist/WishlistPage.js"
import ProfilePageLoader from "./pages/profile/ProfilePage.js"
import ProductPageLoader from "./pages/products/ProductPage.js"

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* ProductPage / MainPage */
router.get("/", async (req, res) => {
    const pageData = await ProductPageLoader(req, res)
    const pagePath = "pages/products/ProductPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* CartPage */
router.get("/cart", async (req, res) => {
    const pageData = await CartPageLoader(req, res)
    const pagePath = "pages/cart/CartPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* checkoutPage */
router.get("/checkout", async (req, res) => {
    const pageData = await CheckoutPageLoader(req, res)
    const pagePath = "pages/checkout/CheckoutPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* LoginPage */
router.get("/login", async (req, res) => {
    const pageData = await LoginPageLoader(req, res)
    const pagePath = "pages/login/LoginPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: true,
        excludeFooter: true,
    })
})

/* orders */
router.get("/orders", async (req, res) => {
    const pageData = await OrderPageLoader(req, res)
    const pagePath = "pages/orders/OrderPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* profile */
router.get("/profile", async (req, res) => {
    const pageData = await ProfilePageLoader(req, res)
    const pagePath = "pages/profile/ProfilePage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* register */
router.get("/register", async (req, res) => {
    const pageData = await RegisterPageLoader(req, res)
    const pagePath = "pages/register/RegisterPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: true,
        excludeFooter: true,
    })
})

/* wishlist */
router.get("/wishlist", async (req, res) => {
    const pageData = await WishlistPageLoader(req, res)
    const pagePath = "pages/wishlist/WishlistPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/**
 * Handle Page render
 * @param {*} res
 * @param {*} page
 * @param {*} pageData
 * @param {*} layoutOptions
 */
function renderPage(res, page, pageData, layoutOptions = {}) {
    const fullPagePath = path.join(__dirname, page + ".ejs")

    ejs.renderFile(fullPagePath, pageData, (err, html) => {
        if (err) {
            return res.status(500).send("Rendering Error: " + err.message)
        }

        // Extract filename for CSS (e.g., "ContactPage.css")
        const cssFile = path.basename(page) + ".css"

        res.render("index", {
            ...layoutOptions,
            title: pageData.title || "Webshop",
            bodyContent: html,
            cssFile,
        })
    })
}

export default router
