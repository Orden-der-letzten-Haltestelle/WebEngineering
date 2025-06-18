import BadRequestError from "../exceptions/BadRequestError.js";
import ProductModel from "../models/product.model.js";

/**
 * Proofs, if given amount fits requirements
 * is not below 1 and not higher then storage amount of product
 * @param {int} productId 
 * @param {int} newAmount 
 * @returns {Promise}
 * @throws {BadRequestError}
 */
async function isValidAmount(productId, newAmount) {
    if (newAmount < 1) {
        throw new BadRequestError(`Given amount ${newAmount} is below one!`)
    }

    //proof, if product as enough items in storage.
    const product = await ProductModel.findProductById(productId)
    if (product.amount < newAmount) {
        throw new BadRequestError(`New amount ${newAmount} is higher then storage amount of product`)
    }
}

export default {
    isValidAmount
}