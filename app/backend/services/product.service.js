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
    const result = ProductModel.findAllProducts()
    return result
}

export default {
    getAllProducts
}
