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
router.get(
    "/",
    handlePage(ProductPageLoader, "pages/products/ProductPage", {
        excludeNavbar: false,
        excludeFooter: false,
    })
)

/* CartPage */
router.get(
    "/cart",
    requireAuth,
    handlePage(CartPageLoader, "pages/cart/CartPage", {
        excludeNavbar: false,
        excludeFooter: false,
    })
)

/* checkoutPage */
router.get(
    "/checkout",
    requireAuth,
    handlePage(CheckoutPageLoader, "pages/checkout/CheckoutPage", {
        excludeNavbar: false,
        excludeFooter: false,
    })
)

/* LoginPage */
router.get(
    "/login",
    handlePage(LoginPageLoader, "pages/login/LoginPage", {
        excludeNavbar: true,
        excludeFooter: true,
    })
)

/* orders */
router.get(
    "/orders",
    requireAuth,
    handlePage(OrderPageLoader, "pages/orders/OrderPage", {
        excludeNavbar: false,
        excludeFooter: false,
    })
)

/* profile */
router.get(
    "/profile",
    requireAuth,
    handlePage(ProfilePageLoader, "pages/profile/ProfilePage", {
        excludeNavbar: false,
        excludeFooter: false,
    })
)

/* register */
router.get(
    "/register",
    handlePage(RegisterPageLoader, "pages/register/RegisterPage", {
        excludeNavbar: true,
        excludeFooter: true,
    })
)

/* wishlist */
router.get(
    "/wishlist",
    requireAuth,
    handlePage(WishlistPageLoader, "pages/wishlist/WishlistPage", {
        excludeNavbar: false,
        excludeFooter: false,
    })
)

/**
 * handles page loading, and loads error page when PageLoader throws an error
 * @param {*} pageLoader
 * @param {*} pagePath
 * @param {*} layoutOptions
 */
function handlePage(pageLoader, pagePath, layoutOptions = {}) {
    return async function (req, res) {
        try {
            const pageData = await pageLoader(req, res)
            renderPage(req, res, pagePath, pageData, layoutOptions)
        } catch (error) {
            renderErrorPage(req, res, error)
        }
    }
}

/**
 * Renders the error page
 * @param {*} req
 * @param {*} res
 * @param {*} error
 */
async function renderErrorPage(req, res, error) {
    const errorPageContent = {
        title: `Unexpected Error${error.status == undefined ? "" : " with Status:" + error.status
            }, try again later`,
        message: error.message == undefined ? "" : error.message,
    }

    renderPage(req, res, "pages/error/ErrorPage", errorPageContent, {
        excludeNavbar: false,
        excludeFooter: false,
    })
}

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
        req.token = token
        next()
    } catch (err) {
        //error, if set token isn't valid, then also redirect to /login
        if (err.status === 403 || err.status === 401) {
            return res.redirect("/login")
        }

        // Render a server error page
        renderErrorPage(req, res, err)
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
            (name) => "http://localhost:3000/" + pagePath + ".css"
        )

        // Also add page-specific CSS:
        const pageCssFile = `http://localhost:3000/${pagePath}.css`
        console.log(pageCssFile)

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
