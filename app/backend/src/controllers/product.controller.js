//import
import ProductService from "../services/product.service.js"

/**
 * Used for the responses and error handling
 * And Verify Inputs
 */

async function listProducts(req, res) {
    try {
        const { value = "", minPrice = "", maxPrice = "" } = req.query
        console.log({
            value: value,
            minPrice: minPrice,
            maxPrice: maxPrice
        })
        const products = await ProductService.getAllProducts(value, minPrice, maxPrice)

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

async function createProduct(req, res) {
    try {
        const { name, description, amount, price } = req.body
        const product = await ProductService.createProduct(
            name,
            description,
            amount,
            price
        )

        res.status(201).json({
            ...product,
        })
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}

async function getProductById(req, res) {
    try {
        const productId = req.params.productId
        const product = await ProductService.getProductById(productId)

        res.status(200).json({
            ...product,
        })
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}

async function updateProduct(req, res) {
    try {
        const { name, description, amount, price } = req.body
        const productId = req.params.productId
        const product = await ProductService.updateProduct(
            productId,
            name,
            description,
            amount,
            price
        )

        res.status(200).json({
            ...product,
        })
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}

async function deleteProductById(req, res) {
    try {
        const productId = req.params.productId
        const product = await ProductService.deleteProductById(productId)

        res.status(200).json({ message: `Deleted Product with Id: ${productId}` })
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}

export default {
    listProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProductById,
}
