//import
import ProductModel from "../models/product.model.js"

/**
 * Buisiness logic für den Produkt service
 */

/**
 * Gets all Products
 * @returns
 */
async function getAllProducts(value, minPrice, maxPrice) {
    const result = await ProductModel.findAllProducts()
    const filtered = result.filter(product => {
        return (maxPrice == "" || product.price <= parseInt(maxPrice)) &&
            (minPrice == "" || product.price >= parseInt(minPrice)) &&
            (product.name.includes(value) || product.description.includes(value))
    })
    return filtered
}

/**
 * returns a product by its Id
 * @param {int} productId
 */
async function getProductById(productId) {
    const result = await ProductModel.findProductById(productId)
    return result
}

async function createProduct(name, description, amount, price) {
    const result = await ProductModel.createProduct(
        name,
        description,
        amount,
        price
    )
    return result
}

async function updateProduct(id, name, description, amount, price) {
    const result = await ProductModel.updateProduct(
        id,
        name,
        description,
        amount,
        price
    )
    return result
}

async function deleteProductById(id) {
    const result = await ProductModel.deleteProductById(id)
    return result
}

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProductById,
}
