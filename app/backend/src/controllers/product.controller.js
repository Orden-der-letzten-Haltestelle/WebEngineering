//import
import ProductService from "../services/product.service.js"
import { pool } from "../models/pool.js"

/**
 * Used for the responses and error handling
 * And Verify Inputs
 */

async function listProducts(req, res) {
    try {
        const products = await ProductService.getAllProducts()

        const data = JSON.stringify(products)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        console.log(
            `Failed listProcuts: \nMessage: ${error.message}; \nStack: ${error.stack}`
        )

        const statusCode = error?.statusCode || 500
        res.status(statusCode).json({
            message: error?.message || "Unexpected Error",
            stack: error?.stack,
        })
    }
}

export default {
    listProducts,
}
