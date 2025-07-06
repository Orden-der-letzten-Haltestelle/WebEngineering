import { ApiError } from "./ApiError.js"
import config from "./config.js"

/**
 * Fetch products information from backend
 * @param {string} token
 * @return {Promise<Object>}
 * @throws {ApiError}
 */
export async function fetchProducts(token) {
    const res = await fetch(`${config.host}/products/`, {
        headers: {
            Authorization: token,
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch user"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return res.json()
}

export async function addProductToCart(productId, token) {
    const res = await fetch(`${config.host}/cart/product/${productId}`, {
        method: "POST",
        headers: {
            Authorization: token,
        },
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to add product to cart"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return res.json()
}
