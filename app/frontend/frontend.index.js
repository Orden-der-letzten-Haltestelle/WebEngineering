import express from "express"
import ejs from "ejs"
import path from "path"
import { fileURLToPath } from "url"
import { getToken } from "./helper.js"

//api
import { fetchUser } from "./api/user.js"

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

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* CartPage */
router.get("/cart", requireAuth, async (req, res) => {
    const pageData = await CartPageLoader(req, res)
    const pagePath = "pages/cart/CartPage"

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* checkoutPage */
router.get("/checkout", requireAuth, async (req, res) => {
    const pageData = await CheckoutPageLoader(req, res)
    const pagePath = "pages/checkout/CheckoutPage"

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* LoginPage */
router.get("/login", async (req, res) => {
    const pageData = await LoginPageLoader(req, res)
    const pagePath = "pages/login/LoginPage"

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: true,
        excludeFooter: true,
    })
})

/* orders */
router.get("/orders", requireAuth, async (req, res) => {
    const pageData = await OrderPageLoader(req, res)
    const pagePath = "pages/orders/OrderPage"

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* profile */
router.get("/profile", requireAuth, async (req, res) => {
    const pageData = await ProfilePageLoader(req, res)
    const pagePath = "pages/profile/ProfilePage"

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* register */
router.get("/register", async (req, res) => {
    const pageData = await RegisterPageLoader(req, res)
    const pagePath = "pages/register/RegisterPage"

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: true,
        excludeFooter: true,
    })
})

/* wishlist */
router.get("/wishlist", requireAuth, async (req, res) => {
    const pageData = await WishlistPageLoader(req, res)
    const pagePath = "pages/wishlist/WishlistPage"

    renderPage(req, res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})

/* Secure Pages, that require signIn */
async function requireAuth(req, res, next) {
    const token = getToken(req)

    //redirect to login page, if no token set
    if (!token) {
        return res.redirect("/login")
    }

    //when token given, then get user Information
    try {
        req.user = await fetchUser(token)
        next()
    } catch (err) {
        //error, if set token isn't valid, then also redirect to /login
        if (err.status === 403 || err.status === 401) {
            return res.redirect("/login")
        }

        // Render a server error page
        const errorPageContent = {
            title: "Unexpected Error, try again later",
            message: err.message || "",
        }
        renderPage(req, res, "pages/error/ErrorPage", errorPageContent, {
            excludeNavbar: false,
            excludeFooter: false,
        })
    }
}

/**
 * Handle Page render
 * @param {*} req
 * @param {*} res
 * @param {*} page
 * @param {*} pageData
 * @param {*} layoutOptions
 */
function renderPage(req, res, pagePath, pageData, layoutOptions = {}) {
    const fullPagePath = path.join(__dirname, pagePath + ".ejs")

    ejs.renderFile(fullPagePath, pageData, (err, html) => {
        if (err) {
            return res.status(500).send("Rendering Error: " + err.message)
        }

        // Compose CSS file paths from components:
        // Each component's CSS assumed at /components/<ComponentName>/<ComponentName>.css
        const componentCssFiles = (pageData.components || []).map(
            (name) => `/components/${name}/${name}.css`
        )

        // Also add page-specific CSS:
        const pageCssFile = `${pagePath}.css`

        // Pass all CSS files as array to template
        const cssFiles = [pageCssFile, ...componentCssFiles]

        res.render("index", {
            ...layoutOptions,
            title: pageData.title || "Webshop",
            bodyContent: html,
            cssFiles: cssFiles,
        })
    })
}

export default router
