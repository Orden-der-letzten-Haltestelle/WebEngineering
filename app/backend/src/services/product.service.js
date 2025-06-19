//import
import ProductModel from "../models/product.model.js"

/**
 * Buisiness logic für den Produkt service
 */

/**
 * Gets all Products
 * @returns
 */
async function getAllProducts() {
    const result = await ProductModel.findAllProducts()
    return result
}

/**
 * returns a product by its Id
 * @param {int} productId
 */
async function getProductById(productId) {
    const result = await ProductModel.findProductById(productId)
    return result
}

export default {
    getAllProducts,
    getProductById,
}
