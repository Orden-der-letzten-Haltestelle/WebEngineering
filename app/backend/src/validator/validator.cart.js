import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import ProductService from "../services/product.service.js";

/**
 * Proofs, if given amount fits requirements
 * is not below 1 and not higher then storage amount of product
 * in addition, it tests if product exists. If not, an NotFoundError is thrown
 * @param {int} productId 
 * @param {int} newAmount 
 * @returns {Promise}
 * @throws {BadRequestError}
 * @throws {NotFoundError}
 */
async function isValidAmount(productId, newAmount) {
    if (newAmount < 1) {
        throw new BadRequestError(`Given amount ${newAmount} is below one!`)
    }

    //proof, if product as enough items in storage.
    const product = await ProductService.getProductById(productId)
    if (product.amount < newAmount) {
        throw new BadRequestError(`New amount ${newAmount} is higher then storage amount of product`)
    }
}

export default {
    isValidAmount
}