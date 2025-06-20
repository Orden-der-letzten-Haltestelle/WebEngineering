import CartPageRouter from "./pages/cart/CartPage.js"

/**
 * In this function are all routes for the frontend defined
 * @param {*} app
 */
export default function appendFrontendRoutes(app) {
    app.use("/cart", CartPageRouter)
}
