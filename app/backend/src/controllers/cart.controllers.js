import CartService from "../services/cart.service.js"

function getCart(req, res) {
    try {
        const userId = req.user.id
        const res = CartService.getCart(userId)

        res.status(200).json({
            ...res,
        })
    } catch (error) {
        console.log(
            `Failed getting cart for user with id: ${userId}; ${error.message}`
        )
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" })
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""))
    }
}

export default {
    getCart,
}
