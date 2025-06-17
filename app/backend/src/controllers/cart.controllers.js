import CartService from "../services/cart.service.js"

async function getCart(req, res) {
    const userId = req.user.id
    try {
        const cartItems = await CartService.getCart(userId)
        res.status(200).json([...cartItems])
    } catch (error) {
        console.log(`Failed getting cart for user with id: ${userId}; ${error}`)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}
async function buyCart(req, res) {
    const userId = req.user.id
    try {
        const orderItems = await CartService.buyCart(userId)
        res.status(200).json([...orderItems])
    } catch (error) {
        console.log(`Failed buy cart for user with id: ${userId}; ${error}`)
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

export default {
    getCart,
    buyCart,
}
