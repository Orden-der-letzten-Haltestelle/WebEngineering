/**
 * Buisiness logic für den Produkt service
 */

const ProductModel = require('../models/product.model')

/**
 * Gets all Products
 * @returns 
 */
async function getAllProducts(){
    const result = ProductModel.findAllProducts()
    return result
}

module.exports = {
    getAllProducts
}