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

export async function createProduct(token, name, description, amount, price) {
    const res = await fetch(`${config.host}/products/`, {
        method: "POST",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description,
            amount: amount,
            price: price,
        }),
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to create Product"
        throw new ApiError(errorMessage, res.status, errorData)
    }

    return await res.json()
}
