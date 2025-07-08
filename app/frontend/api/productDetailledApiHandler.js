import { ApiError } from "./ApiError.js"
import config from "./config.js"

/**
 * Fetch products information from backend
 * @param {string} token
 * @return {Promise<Object>}
 * @throws {ApiError}
 */

export async function fetchProductById(productId) {
    const res = await fetch(`${config.host}/products/${productId}`);

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch product"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json();
}