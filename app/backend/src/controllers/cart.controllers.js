import BadRequestError from "../exceptions/BadRequestError.js"
import CartService from "../services/cart.service.js"

async function getCart(req, res) {
    const userId = req.user.id
    
    try {
        const cartItems = await CartService.getCart(userId)
        res.status(200).json([...cartItems])
    } catch (error) {
        console.log(
            `Failed getCart for user with id: ${userId}; \Message: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function getOrderHistory(req, res) {
    const userId = req.user.id
    try {
        const orderItems = await CartService.getOrderHistory(userId)
        res.status(200).json([...orderItems])
    } catch (error) {
        console.log(
            `Failed getOrderHistory for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function buyCart(req, res) {
    const userId = req.user.id
    try {
        const orderItems = await CartService.buyCart(userId)
        res.status(200).json([...orderItems])
    } catch (error) {
        console.log(
            `Failed buyCart for user with id: ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function changeCartAmount(req, res) {
    const userId = req.user.id
    const cartItemId = req.params.cartItemId
    try {
        const newAmount = parseInt(req.query.amount, 10)

        if (isNaN(newAmount)) {
            throw new BadRequestError(
                `Paramter amount is not given, but required`
            )
        }

        const cartItems = await CartService.updateCartItemAmount(
            userId,
            cartItemId,
            newAmount
        )
        res.status(200).json([...cartItems])
    } catch (error) {
        console.log(
            `Failed changeCartAmount for cartitem with id: ${cartItemId}; \nMessage ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function addProductToCart(req, res) {
    const userId = req.user.id
    const productId = req.params.productId
    try {
        //extract amount from path, when none given, set on 1
        let amount = parseInt(req.query.amount, 10)
        if (isNaN(amount)) {
            amount = 1
        }

        const cartItems = await CartService.addProductToCart(
            userId,
            productId,
            amount
        )
        res.status(201).json([...cartItems])
    } catch (error) {
        console.log(
            `Failed addProductToCart with productId ${productId} to cart of user with id ${userId}; \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function deleteCartItem(req, res) {
    const userId = req.user.id
    const cartItemId = req.params.cartItemId
    try {
        const cartItems = await CartService.deleteCartItem(userId, cartItemId)
        res.status(200).json([...cartItems])
    } catch (error) {
        console.log(
            `Failed deleteCartItem with cartItemId ${cartItemId}: \nMessage ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

async function deleteCart(req, res) {
    const userId = req.user.id
    try {
        await CartService.deleteCart(userId)
        res.status(200).json()
    } catch (error) {
        console.log(
            `Failed deleteCart for user with id ${userId}: \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

export default {
    getCart,
    getOrderHistory,
    buyCart,
    changeCartAmount,
    addProductToCart,
    deleteCartItem,
    deleteCart,
}
