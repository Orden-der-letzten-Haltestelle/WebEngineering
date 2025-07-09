import { ApiError } from "./ApiError.js"
import config from "./config.js"

/**
 * Fetch products information from backend
 * @param {string} token
 * @return {Promise<Object>}
 * @throws {ApiError}
 */
export async function fetchProducts(value, minPrice, maxPrice) {
    const res = await fetch(
        `${config.host}/products/?value=${value}&minPrice=${minPrice}&maxPrice=${maxPrice}`
    )

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch products"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return res.json()
}

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


export async function updateProduct(productId, token, name, description, price, amount) {
    console.log(name)
    const res = await fetch(`${config.host}/products/${productId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({
            name: name,
            description: description,
            price: price,
            amount: amount
        })
    });

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch product"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json();
}