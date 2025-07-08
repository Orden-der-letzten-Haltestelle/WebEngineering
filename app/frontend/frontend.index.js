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
import LoginPasswordPageLoader from "./pages/login/loginPassword/LoginPage.js"
import LoginChoicePageLoader from "./pages/login/loginChoice/LoginPage.js"
import LoginSupportPageLoader from "./pages/login/PasswordSupport/passwordSupport.js"
import LoginMailLinkPageLoader from "./pages/login/loginMail/Link/LoginPage.js"
import OrderPageLoader from "./pages/orders/OrderPage.js"
import RegisterPageLoader from "./pages/register/RegisterPage.js"
import DetailedWishlistPageLoader from "./pages/wishlist/detailedWishlist/DetailedWishlistPage.js"
import ProfilePageLoader from "./pages/profile/ProfilePage.js"
import ProductPageLoader from "./pages/products/ProductPage.js"
import AdminPageLoader from "./pages/admin/AdminPage.js"

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* ProductPage / MainPage */
router.get(
    "/",
    notRequiredAuth,
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

/* LoginPage Choice */
router.get(
    "/login",
    handlePage(LoginChoicePageLoader, "pages/login/loginChoice/LoginPage", {
        excludeNavbar: true,
        excludeFooter: true,
    })
)
/* LoginPage with Password */
router.get(
    "/loginPassword",
    handlePage(LoginPasswordPageLoader, "pages/login/LoginPassword/LoginPage", {
        excludeNavbar: true,
        excludeFooter: true,
    })
)
/* LoginPage with Mail Link */
router.get(
    "/loginMail/Link",
    handlePage(
        LoginMailLinkPageLoader,
        "pages/login/loginMail/Link/LoginPage",
        {
            excludeNavbar: true,
            excludeFooter: true,
        }
    )
)
/* LoginPage Support for forgotten Password */
router.get(
    "/login/passwordSupport",
    handlePage(
        LoginSupportPageLoader,
        "pages/login/PasswordSupport/passwordSupport",
        {
            excludeNavbar: true,
            excludeFooter: true,
        }
    )
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

router.get(
    "/wishlist/:wishlistId",
    requireAuth,
    handlePage(DetailedWishlistPageLoader,"pages/wishlist/detailedWishlist/DetailedWishlistPage", {
        excludeNavbar: false,
        excludeFooter: false,
    })
)

/* wishlist */
router.get(
    "/admin",
    requireAuth,
    requireAdmin,
    handlePage(AdminPageLoader, "pages/admin/AdminPage", {
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
        title: `Unexpected Error${
            error.status == undefined ? "" : " with Status:" + error.status
        }, try again later`,
        message: error.message == undefined ? "" : error.message,
    }

    renderPage(req, res, "pages/error/ErrorPage", errorPageContent, {
        excludeNavbar: false,
        excludeFooter: false,
    })
}

/* Secure Pages, that require signIn */
async function notRequiredAuth(req, res, next) {
    const token = getToken(req)

    //redirect to login page, if no token set
    if (!token) {
        next()
        return
    }

    //when token given, then get user Information
    try {
        req.user = await fetchUser(token)
        req.token = token
        next()
    } catch (err) {
        //error, if set token isn't valid, then also redirect to /login
        if (err.status === 403 || err.status === 401) {
            res.clearCookie("token")
            next()
            return
        }

        // Render a server error page
        renderErrorPage(req, res, err)
    }
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

async function requireAdmin(req, res, next) {
    const token = req.token
    if (!token) {
        throw new Error("Token is required")
    }

    const user = req.user

    if (!user.roles.includes("admin")) {
        throw new Error("you are not allowed to enter this page")
    }
    next()
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
            (name) => `http://localhost:3000/components/${name}/${name}.css`
        )

        // Also add page-specific CSS:
        const pageCssFile = `http://localhost:3000/${pagePath}.css`

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
